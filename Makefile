all: install
	cd src/client && npm run build && cd ../server && npm run build

install:
	cd src/client && npm install && cd ../server && npm install

clean:
	cd src/server && rm -rfd target build && cd ../client && rm -rfd build

dev:
	cd src/server && npm run dev