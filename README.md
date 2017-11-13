# Project Ubin Phase 2 - Common UI

This repository contains the source code for the common UI deployed in Project Ubin Phase 2. 

The UI is a consolidated UI that allows single page access to all banks and MAS view. Only one instance is required per platform.

## Pre-requisite

```sh
npm -g install grunt
npm install
bower install
```

## Development mode
To run a live server, execute `grunt serve:ubin --env=<platform>` where platform can be `corda`, `fabric` and `quorum`.

## Deployment
1. To run in the background, execute the following (platform can be `corda`, `fabric` and `quorum`)

```sh
grunt build:ubin --env=<platform>
```

2. Go to the `dist` folder

```sh
cd dist
```

3. Start the http-server in the background (example port is 7001 below)

```sh
nohup http-server -p 7001 &
```

# License

Copyright 2017 The Association of Banks in Singapore

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.