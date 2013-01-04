import qrcode as QR
from qrcode.image.svg import SvgImage
import svgutils.transform as sg
import sys, math

class Generate:

	def __init__(self, uid, source, target):
		qr = QR.QRCode(
		    version          = 1,
		    error_correction = QR.constants.ERROR_CORRECT_L,
		    box_size         = 10,
		    border           =  0,
		)
		qr.add_data('http://yapp.cd/' + str(uid) + '/' + str(source) + '/' + str(target))
		qr.make(fit=True)

		qr.image = qr.make_image(SvgImage)
		qr.image.save('tmp/qr.svg')

		# load matpotlib-generated figures
		qr.svg = sg.fromfile('tmp/qr.svg')
		qr.svg.size   = qr.svg.get_size()
		qr.svg.width  = float(qr.svg.size[0].replace('px',''))
		qr.svg.height = float(qr.svg.size[1].replace('px',''))
		qr.svg.root   = qr.svg.getroot()

		# get info about frame
		frame  = sg.fromfile('resources/frame.svg')
		frame.size   = frame.get_size();
		frame.height = float(frame.size[0].replace('px',''))
		frame.width  = float(frame.size[1].replace('px',''))
		frame.root   = frame.getroot()

		scale = 0.8

		qr.svg.root.rotate(-120, qr.svg.width/2, qr.svg.height/2)
		qr.svg.root.moveto(25, 25, scale)

		fig = sg.SVGFigure(str(frame.width) + 'px', str(frame.height) + 'px')
		fig.append([qr.svg.root, frame.root])
		self.path = "result/" + str(source) + "_" + str(target) + "_" + str(uid) + ".svg"
		fig.save(self.path)
