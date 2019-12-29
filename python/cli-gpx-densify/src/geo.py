import math as Math

class Geo:
    RADIUS = 6371e3 # Earth's radious in meters

    def __init__(self, pointA, pointB):
        self.lat1 = Math.radians(pointA[0])
        self.lon1 = Math.radians(pointA[1])
        self.lat2 = Math.radians(pointB[0])
        self.lon2 = Math.radians(pointB[1])
        self.latΔ = Math.radians(pointB[0] - pointA[0])
        self.lonΔ = Math.radians(pointB[1] - pointA[1])

        self.adist = ( # angular distance
            (Math.sin(self.latΔ /2) **2) +
            Math.cos(self.lat1) *
            Math.cos(self.lat2) *
            (Math.sin(self.lonΔ /2) **2)
        )

        self.distance = ( # in meters
            self.RADIUS *
            Math.atan2(
                Math.sqrt(self.adist),
                Math.sqrt(1- self.adist)
            )
        )

        self.bearing = Math.atan2( # in radians
            Math.sin(self.lonΔ) * Math.cos(self.lat2),
            (
                Math.cos(self.lat1) *
                Math.sin(self.lat2) -
                (Math.sin(self.lat1) * Math.cos(self.lat2) * Math.cos(self.lonΔ))
            )
        )

    def point(self, distance):
        cosD = Math.cos(distance / self.RADIUS)
        sinD = Math.sin(distance / self.RADIUS)
        return [
            Math.degrees(Math.asin(
                Math.sin(self.lat1) * cosD +
                Math.cos(self.lat1) * sinD * Math.cos(self.bearing)
            )),
            Math.degrees(
                self.lon1 +
                Math.atan2(
                    Math.sin(self.bearing) * sinD * Math.cos(self.lat1),
                    cosD - Math.sin(self.lat1) * Math.sin(self.lat2)
                )
            )
        ]
