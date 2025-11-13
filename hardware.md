//Hardware Description for the SeatSync presence detection device//

The two main components will be a Passive Infrared Radiation (PIR) Sensor Module for detection of 
people within the vicinity of the device, and the ESP32 Microcontroller for powering the sensor, 
collecting its data, and relaying seat availability to the database over WiFi, which is then displayed for end user use on the SeatSync app.

For the purpose of the prototype, the ESP32 will be powered by a portable USB power bank, which should provide sufficient mAh for use in the system over a long period.


//Update 11-11-25

3 female-to-female jumper cables are used to connect the 3 pins of the HC-SR501 PIR Sensor to the ESP 32. 
They connect the GND pin to the onboard GND Pin, the Vin to the 3.3V output onboard pin, and the Vout to GPIO Pin 32.
The ESP32 and PIR Sensor were rented from the IEEE Parts Store.

//Update 11-12-25

//Firmware

The firmware was written in C++ using the Arduino IDE, before being compiled and uploaded to the ESP32. The packages used include Wifi.h and HTTPClient.h. The sensor data is read from analog input, which is then converted to a boolean value. That boolean value of motion detected is then send to a server through a post request to the server's URL. The data sent comes in the form of a JSON payload, which needs the sensor value as a boolean and the ID number of the device, which, for the purposes of demonstration, is 1 for the prototype unit. The ESP32 sends data every 2 seconds.

//Hardware

While the ESP32 has been powered by USB-C to Micro-USB from a computer, it needs to have standalone power. In order to manage the power, a portable power bank will be used to power the ESP32 and the sensor when not connected to the computer. The setup of the prototype is pictured below.

![seatsensor](https://github.com/user-attachments/assets/36641bdf-b409-4fa1-bcb0-c9d4923cb60e)

