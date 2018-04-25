[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
# fidelia-plugin-word-client
## Overview
This project provides the user interface part of the agosense.fidelia word plugin
## Build
It is highly recommended to use the node version manager [nvm](https://github.com/creationix/nvm).
The build was tested using version `9.6.1`.
Typcial commands to install and use this version are:
```
nvm install 9.6.1
nvm use 9.6.1
```
After cloning the git project into a local work directory `work`, make sure you install the dependencies, from `work` directory run:
```
npm install
```
The final step is to produce the distributable files, run:
```
npm run webpack
```
The folder `dist` inside your `work` folder will contain the distributable files.
## License
This project is licensed under GPLv3, which means you can freely distribute and/or modify the source code, as long as you share your changes with us
