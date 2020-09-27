# msc-proj

## Visual Studio Code

VSCode is an IDE that has the option for DAML syntax highlighting. Download from https://code.visualstudio.com/download 


## DAML SDK

The DAML SDK includes the compiler and provides syntax highlighting for VSCode.
Follow the installation instructions at https://docs.daml.com/getting-started/installation.html Don’t forget to add the bin folder to the PATH variable (this step is also outlined in the installation instructions). 


## Yarn

Yarn was the package manager used for the UI development. Installing Yarn may also require you to install Homebrew (on macOS).
Yarn: https://classic.yarnpkg.com/en/docs/install/#mac-stable
Homebrew: https://brew.sh/

## Building and Running the Application

1) Open a terminal
2) Run **make build** from */msc-proj/code/trunk/app*
3) Run **daml start** from */msc-proj/code/trunk/app*
4) Open a second terminal
5) Wait for the DAML server to start - (‘Started server:...’ message in the first terminal)
6) Run **yarn start** from */msc-proj/code/trunk/app/ui*
7) Go to *localhost:3000* in your browser
8) Log in as *Farmer Fred*
9) If no sample data loads in the *Products* table straight away, wait and refresh the page
