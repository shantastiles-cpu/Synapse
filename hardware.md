//Hardware Description for the SeatSync presence detection device//

The two main components will be a Passive Infrared Radiation (PIR) Sensor Module for detection of 
people within the vicinity of the device, and the ESP32 Microcontroller for powering the sensor, 
collecting its data, and relaying seat availability to the database over WiFi, which is then displayed for end user use on the SeatSync app.

For the purpose of the prototype, the ESP32 will be powered by a portable USB power bank, which should provide sufficient mAh for use in the system over a long period.


//Update 11-11-25

3 female-to-female jumper cables are used to connect the 3 pins of the HC-SR501 PIR Sensor to the ESP 32. 
They connect the GND pin to the onboard GND Pin, the Vin to the 3.3V output onboard pin, and the Vout to GPIO Pin 32.
The ESP32 and PIR Sensor were rented from the IEEE Parts Store
