fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
### push_cert
```
fastlane push_cert
```

### dev
```
fastlane dev
```


----

## iOS
### ios internal_beta_fabric
```
fastlane ios internal_beta_fabric
```
Send an iOS build to Fabric for testing
### ios internal_beta_itc
```
fastlane ios internal_beta_itc
```
Send an iOS build to TestFlight for testing
### ios internal_development_itc
```
fastlane ios internal_development_itc
```
Test a development build

----

## Android
### android internal_beta_play
```
fastlane android internal_beta_play
```
Send an Android build to the Play Store for testing
### android internal_development_play
```
fastlane android internal_development_play
```
Test a development build

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
