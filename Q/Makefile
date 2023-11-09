# Build the Electron app
all:
	npm install
	npx electron-vite build

# Install frontend dependencies
node_modules: package.json
	npm install

# Remove build files and installed dependencies
.PHONY: clean
clean:
	rm -rf node_modules


	