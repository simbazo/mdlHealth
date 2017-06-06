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
### Setting up:
* Fork this repository to your local file system.
* Edit the **settings.json** file to provide details about the application and its publications, and where the publication data is stored.
* Clear the contents of the **/data** folder and copy the json data, images, PDFs and other content files into it.
* If you are building an iOS mobile app, add the iOS platform:
    `sudo cordova platform add ios`
* Ensure you have a device plugged in (or use a virtual device, such as offered by <https://www.genymotion.com>). Then launch the app:
    `[sudo] cordova run android | ios`


