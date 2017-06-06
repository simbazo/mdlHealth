# MiDigitalLife Health App Repository

Health is an Apache Cordova project built with **Backbone Marionette**, **jQuery Mobile** and **Bootstrap**. It may be used to generate a hybrid web or mobile application. The application is essentially a reader that renders HTML and PDF medical documentation. 

## Getting Started with Health
### Prerequisites:
* **Windows**, **Mac OS**, or **Linux** - When targeting the **iOS** platform you will need to run this project on a **Mac**.
* **Node** - version 6.0+
* **Cordova** - version 6.0+
* **Android SDK** - if targeting the **android** platform
* **iOS SDK** - if targeting the **iOS** platform
* **Gradle** - version 3.5+
### Cordova plugin dependencies:
* Run `[sudo] cordova plugin add [plugin-name]'
* cordova-plugin-compat 1.0.0 "Compat"
* cordova-plugin-device 1.1.6 "Device"
* cordova-plugin-dialogs 1.3.3 "Notification"
* cordova-plugin-file 4.3.3 "File"
* cordova-plugin-file-transfer 1.6.3 "File Transfer"
* cordova-plugin-inappbrowser 1.7.1 "InAppBrowser"
* cordova-plugin-network-information 1.3.3 "Network Information"
* cordova-plugin-splashscreen 4.0.3 "Splashscreen"
* cordova-plugin-whitelist 1.3.2 "Whitelist"
### Setting up:
* Fork this repository to your local file system.
* Edit the **settings.json** file to provide details about the application and its publications, and where the publication data is stored.
* Clear the contents of the **/data** folder and copy the json data, images, PDFs and other content files into it.
* If you are building an iOS mobile app, add the iOS platform:
    `sudo cordova platform add ios`
* Ensure you have a device plugged into a local USB port (or use a virtual device, such as offered by <https://www.genymotion.com>). Then launch the app:
    `[sudo] cordova run android | ios`


