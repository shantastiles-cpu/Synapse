#include <WiFi.h>
#include <HTTPClient.h>

// Define the digital pin connected to the PIR sensor's OUT pin
const int pirSensorPin = 32; // Connect PIR OUT to GPIO Pin 32

// Variable to store the motion sensor's state
int analogState = 0;

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

  // Add a small delay to avoid excessive serial output
  delay(2000);
  sendMotionData();//Post to HTTPS

}

void sendMotionData() {
  if (WiFi.status() == WL_CONNECTED) {
    bool motionState = false; 
    if (analogState > 3000) {
    //If motion is detected (HIGH)
    motionState = true;
    Serial.println("Motion Detected!");
    Serial.println(analogState);
  } else {
    motionState = false;
    // If no motion is detected (LOW)
    Serial.println("No Motion Detected");
    Serial.println(analogState);
  }

  int deviceID = 1; //Define the number of the device

  //JSON Payload to Send
  String payload = "{";
  payload += "\"deviceID\": ";
  payload += deviceID;
  payload += ", \"motionDetected\": ";
  payload += (motionState ? "true" : "false");
  payload += "}";

  
  const char* url = "https://capitularly-tariffless-alaysia.ngrok-free.dev/api/sensor"; //Define link to server

  //Initialize HTTPS Client
  HTTPClient https;
  https.begin(url);
  https.addHeader("Content-Type", "application/json");

  Serial.print("Sending motion data: ");
  Serial.println(payload);

  int httpResponseCode = https.POST(payload);

  //Printing Response
  if (httpResponseCode > 0) {
    Serial.printf("Response code: %d\n", httpResponseCode);
    String response = https.getString();
    Serial.println("Response:");
    Serial.println(response);
  } else {
    Serial.printf("Error in POST: %d\n", httpResponseCode); //Outputting exceptions
  }

  https.end();
} else {
  Serial.println("WiFi disconnected, attempting reconnect...");
  WiFi.reconnect();
}
}
