import os as Os
import math as Math
from copy import deepcopy as DeepCopy
from datetime import datetime as DateTime
from lxml import etree as Tree
from geo import Geo

PATH = '%s/../data' % Os.path.dirname(Os.path.realpath(__file__))

# read as binary data to avoid issues wuth unicode
healthFile = open('%s/mtv-health.tcx' % PATH, 'rb')
healthTree = Tree.parse(healthFile)
healthRoot = healthTree.getroot()
healthNspc = { 'tcx': healthRoot.nsmap[None] }
healthNodes = healthRoot.xpath('.//tcx:Trackpoint', namespaces = healthNspc)
healthLen = len(healthNodes)

routeFile = open('%s/mtv-route.gpx' % PATH, 'rb')
routeTree = Tree.parse(routeFile)
routeRoot = routeTree.getroot()
routeNspc = { 'gpx': routeRoot.nsmap[None] }
routeNodes = routeRoot.xpath('//gpx:trkpt', namespaces = routeNspc);
routeLen = len(routeNodes)

countItems = healthLen - routeLen
countMult = Math.floor(countItems / routeLen)
countRemd = countItems % routeLen

def densify(targetNodes, factor):
    for i, curr in enumerate(targetNodes):
        if (i == len(targetNodes) - 1): break
        next = targetNodes[i + 1]
        parent = curr.getparent()
        # Obtain data from both current and next nodes
        nodes = { 'curr': curr, 'next': next }
        for key, node in nodes.items(): nodes[key] = {
            # 'time': DateTime.strptime(node[0].text, '%Y-%m-%dT%H:%M:%SZ'),
            'lat': float(node.attrib['lat']),
            'lon': float(node.attrib['lon']),
            'node': node,
        }
        # using the geodata, create a virtual line to get information.
        line = Geo(
            [nodes['curr']['lat'], nodes['curr']['lon']],
            [nodes['next']['lat'], nodes['next']['lon']]
        );
        # subdivide the line into corresponding chunks and add the to the tree after curr
        for j in range(factor):
            pointC = line.point(line.distance * (1 / (j+1)))
            node = DeepCopy(curr)
            node.attrib['lat'] = '%.7f' % round(pointC[0], 7)
            node.attrib['lon'] = '%.7f' % round(pointC[1], 7)
            curr.addnext(node)

densify(routeNodes, countMult)

densifiedNodes = routeRoot.xpath('//gpx:trkpt', namespaces = routeNspc)
densify(densifiedNodes[-2:], countRemd + countMult)

for i, curr in enumerate(healthNodes):
    prev = healthNodes[i-1] if i > 0 else curr
    time = curr.xpath('tcx:Time', namespaces=healthNspc)[0].text
    # get bpm, if none available, get previous
    hr = curr.xpath('tcx:HeartRateBpm/tcx:Value', namespaces=healthNspc)
    if len(hr) == 0:
        curr.append(DeepCopy(prev.xpath('tcx:HeartRateBpm', namespaces=healthNspc)[0]))
        hr = curr.xpath('tcx:HeartRateBpm/tcx:Value', namespaces=healthNspc)
    hr = int(hr[0].text)
    # get cadence, if none available, get previous
    cadence = curr.xpath('tcx:Cadence', namespaces=healthNspc)
    if len(cadence) == 0:
        curr.append(DeepCopy(
            curr.xpath('//preceding-sibling::tcx:Cadence', namespaces=healthNspc)[-1]
        ))
        cadence = curr.xpath('tcx:Cadence', namespaces=healthNspc)
    cadence = int(cadence[0].text)
    # get cadence, if none available, get previous

    # get speed, if none available, get previous
    # speed = curr.xpath('tcx:Extensions', namespaces=healthNspc)
    # if len(speed) == 0:
    #     curr.append(DeepCopy(
    #         curr.xpath('//preceding-sibling::tcx:Extensions', namespaces=healthNspc)[-1]
    #     ))
    #     speed = curr.xpath('tcx:Extensions', namespaces=healthNspc)
    # npspc = {'ext': 'http://www.garmin.com/xmlschemas/ActivityExtension/v2'}
    # speed = float(speed[0].xpath('ext:TPX/ext:Speed', namespaces=npspc)[0].text)

    if i >= len(densifiedNodes): continue
    # insert all the data in the densifiedNodes
    node = densifiedNodes[i]
    node.xpath('gpx:time', namespaces=routeNspc)[0].text = time
    node.append(Tree.fromstring('''
    <extensions>
        <gpxtpx:TrackPointExtension
            xmlns:gpxtpx='http://www.garmin.com/xmlschemas/TrackPointExtension/v1'>
            <gpxtpx:hr>%s</gpxtpx:hr>
            <gpxtpx:cad>%s</gpxtpx:cad>
        </gpxtpx:TrackPointExtension>
    </extensions>
    ''' % (hr, cadence)))


with open('%s/mv-densified.gpx' % PATH, 'wb') as doc:
    doc.write(Tree.tostring(routeRoot, pretty_print = True))

print('Saved densified file')
