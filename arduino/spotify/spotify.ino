#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define SS_PIN D8
#define RST_PIN D0

#define statusIndicator D1
#define buttonPin D2

MFRC522 rfid(SS_PIN, RST_PIN);

MFRC522::MIFARE_Key key;

const String DEVICE_ID = "12345678900";

const char *ssid = "SSID";
const char *pass = "PASS";

WiFiClientSecure client;
HTTPClient http;

void setup() {
  pinMode(statusIndicator, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(115200);
  initWiFi();
  initRfid();
}

void loop() {
  // read the state of the pushbutton value:
  int buttonState = !digitalRead(buttonPin);

  digitalWrite(statusIndicator, buttonState);

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (!rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been readed
  if (!rfid.PICC_ReadCardSerial())
    return;

  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  // Check is the PICC of Classic MIFARE type
  if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI && piccType != MFRC522::PICC_TYPE_MIFARE_1K && piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
    Serial.println(F("Your tag is not of type MIFARE Classic."));
    return;
  }




  const String cardId = getCardId(rfid.uid.uidByte, rfid.uid.size);
  Serial.println("-----------------------------------------------");
  Serial.println(cardId);
  if (WiFi.status() == WL_CONNECTED) {

    if (buttonState == true) {
      Serial.println("1");
      String uri = "https://spotify-arduino.vercel.app/api/card";
      String body = "{\"cardId\":\"" + cardId + "\",\"value\":\"\"}";
      postRequest(uri, body);
    } else {
      Serial.println("2");
      String uri = "https://spotify-arduino.vercel.app/api/"+DEVICE_ID+"/play?cardId="+cardId;
      getRequest(uri);
    }
  }

  // Halt PICC
  rfid.PICC_HaltA();

  // Stop encryption on PCD
  rfid.PCD_StopCrypto1();
}


/**
 		Helper routine to dump a byte array as hex values to Serial.
*/
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}

/**
 		Helper routine to dump a byte array as dec values to Serial.
*/
String getCardId(byte *buffer, byte bufferSize) {
  String id;
  for (byte i = 0; i < bufferSize; i++) {
    id += buffer[i];
  }
  Serial.println(id);
  return id;
}


void initWiFi() {
  client.setInsecure();
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println('\n');
  Serial.println("Connection established!");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());
}

void initRfid() {
  SPI.begin();      // Init SPI bus
  rfid.PCD_Init();  // Init MFRC522
  Serial.println();
  Serial.print(F("Reader :"));
  rfid.PCD_DumpVersionToSerial();

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  Serial.println();
  Serial.println(F("This code scan the MIFARE Classic NUID."));
  Serial.print(F("Using the following key:"));
  printHex(key.keyByte, MFRC522::MF_KEY_SIZE);
}

void getRequest(String url) {
  http.begin(client, url);
  int httpResponseCode = http.GET();
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  http.end();
}

void postRequest(String url, String body) {
  http.begin(client, url);
  int httpResponseCode = http.POST(body);
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  http.end();
}
