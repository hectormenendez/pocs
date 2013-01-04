import util as Util

ver = 21

class QR:

	def __init__(self, data):
		"""
		Write something
		"""
		if not isinstance(data, basestring):
			try: data = str(data)
			except UnicodeEncodeError: data = unicode(data)
		if isinstance(data, unicode):
			data = data.encode('utf-8')
		self.data = data

	def dunno(self, test):
		self.module = [None] * ver
		for row in range(ver):
			self.module[row] = [None] * ver
			for col in range(ver):
				self.module[row][col] = None
		self.module_position(0,0)
		self.module_position(ver - 7, 0)


	def module_position(self, row, col):
		for r in range(-1, 8):
			if  row + r <= -1 or ver <= row + r: continue
			for c in range(-1, 8):
				if col + c <= 1 or ver <= col + c : continue
				if ( 0 <= r and r <= 6
				and (c == 0 or c == 6)
				or  (0 <= c and c <= 6 and (r == 0 or r == 6))
				or  (2 <= r and r <= 4 and 2 <= c and c <= 4)):
					self.module[row + r][col + c] = True
				else:
					self.module[row + r][col + c] = False

qr = QR('http://yapp.cd/1000/10/1')

test = [None] * 3

print dict(test)