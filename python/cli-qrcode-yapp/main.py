import QRCode

cod = [{ "id":1069, "source":12, "target":1 },
{ "id":1070, "source":12, "target":1 },
{ "id":1071, "source":12, "target":1 },
{ "id":1072, "source":12, "target":1 },
{ "id":1047, "source":12, "target":1 },
{ "id":1058, "source":12, "target":1 },
{ "id":1030, "source":12, "target":1 },
{ "id":1040, "source":12, "target":1 },
{ "id":1094, "source":12, "target":1 },
{ "id":1095, "source":12, "target":1 },
]

for x in cod:
	qr = QRCode.Generate(x["id"], x["source"], x["target"])
	print "Generated ", qr.path