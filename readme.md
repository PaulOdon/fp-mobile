# config

- rename `.env.example` file to `.env`
- change the ip address to your server ip address (don't do it localhost)

# Dependancies for integration

- axios
- formik && yup
- react-native-toast-message
- @react-native-async-storage/async-storage
- react-native-dotenv

# SDK issues

- check android SDK version in your project /android/build.gradle and verify yours (sdk version) with android studio ==> you must install the same version

# Error : Ranimated 2 failed to create a worklet, maybe you forgot to add Reanimated's babel plugin

- add this line in you babel config file : `plugins: ['react-native-reanimated/plugin']` ==> to solve this issues
