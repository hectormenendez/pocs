import QRCode

cod = [
    { "id":1530, "source":18, "target":1 },
    { "id":1531, "source":18, "target":1 },
    { "id":1532, "source":18, "target":1 },
    { "id":1533, "source":18, "target":1 },
    { "id":1534, "source":18, "target":1 },
    { "id":1535, "source":18, "target":1 },
    { "id":1536, "source":18, "target":1 },
    { "id":1537, "source":18, "target":1 },
    { "id":1538, "source":18, "target":1 },
]


for x in cod:
	qr = QRCode.Generate(x["id"], x["source"], x["target"])
	print "Generated ", qr.path
