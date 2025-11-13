#include <WiFi.h>
#include <HTTPClient.h>

// Define the digital pin connected to the PIR sensor's OUT pin
const int pirSensorPin = 32; // Connect PIR OUT to GPIO Pin 32

// Variable to store the motion sensor's state
int analogState = 0;
int motionEvents =  0;
int loops = 0; //Loop variable will help with timing the data transmission
bool motionState = false;

void setup() {
  
  // Initialize serial communication at 9600 baud rate
  Serial.begin(9600);
  
  //Connect to TAMU IOT WiFi
  WiFi.begin("TAMU_IoT","");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("."); //Connect to WiFi
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to TAMU IoT");
  }
  // Set the PIR sensor pin as an input
  pinMode(pirSensorPin, INPUT);
  Serial.println("Setup complete");
}

void loop() {
  // Read the value from the PIR sensor in mV
  analogState = analogRead(pirSensorPin);

  if (WiFi.status() == WL_CONNECTED) {
    
    if (analogState > 3000) {
    //If motion is detected (HIGH)
    motionState = true;
    Serial.println("Motion Detected!");
    Serial.println(analogState);
    motionEvents++;
  } if (analogState < 3000) {
    motionState = false;
    // If no motion is detected (LOW)
    Serial.println("No Motion Detected");
    Serial.println(analogState);
  }
  }
  // Add a small delay to avoid excessive serial output
  delay(5000);
  loops++; //Records number of sensor checks the ESP32 has perform before it sends data to the server 
  if (loops == 12) { //12 loops * 5000ms means that it sends data every 36000ms or 60 seconds
    //Post to HTTPS
    loops = 0;
    if (motionEvents > 1) { //If more than one movement has occured within the last minute, it implies that the study space is occupied.
      motionState = true;
    }
    motionEvents = 0; //Reset the number of motion states for the next minute
    sendMotionData(motionState); //Send data with the boolean parameter of motion detection
  }

}
void sendMotionData(bool motionStateParameter) {

  int deviceID = 1; //Define the number of the device

  bool State = motionStateParameter;
  //JSON Payload to Send
  String payload = "{";
  payload += "\"deviceID\": ";
  payload += deviceID;
  payload += ", \"motionDetected\": ";
  payload += (State ? "true" : "false"); //Write true or false depending upon the parameter passed in the function
  payload += "}";

  
  const char* url = "https://capitularly-tariffless-alaysia.ngrok-free.dev/api/sensor"; //Define link to server

  //Initialize HTTPS Client
  HTTPClient https;
  https.begin(url);
  https.addHeader("Content-Type", "application/json");

  Serial.print("Sending motion data: ");
  Serial.println(payload);

  int httpResponseCode = https.POST(payload); //Send JSON Payload to server

  //Printing Response
  if (httpResponseCode > 0) {
    Serial.printf("Response code: %d\n", httpResponseCode);
    String response = https.getString();
    Serial.println("Response:");
    Serial.println(response);
  } 
  else if (WiFi.status() != WL_CONNECTED) { //Handling WiFi disconnect
    Serial.println("WiFi disconnected, attempting reconnect...");
    WiFi.reconnect();
  }
  else {
    Serial.printf("Error in POST: %d\n", httpResponseCode); //Outputting exceptions
  }

  https.end(); //Exit HTTPS client
} 
