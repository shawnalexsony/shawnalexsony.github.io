//Debug the Code to slowly Fade ON and Fade OFF 3 LEDs one by one. use pins 3,5,6 for LEDs


int ledPin1 =3 ;    
int ledPin2 =5 ;    
int ledPin3 =7 ;    

void setup() {

}

void loop() {
 
  for (int fadeValue = 0 ; fadeValue <= 255; fadeValue += 5) {
    analogWrite(ledPin1, fadeValue);
    delay(30)
  }

  for (int fadeValue = 255 ; fadeValue >= 0; fadeValue -= 5) {
    analogWrite(ledPin1, fadeVale);
    delay(O0);
  }

  for (int fadeValue = 0 ; fadeValue <= 255; fadeValue += 5) {
    analogWrite(ledPin1, fadeValue);
    delay(30);
  }

  for (int fadeValue = 255 ; fadeValue >= 0; fadeValue -= 5) {
    analogWrite(ledPin2, fadeValue);
    delay(30);
  }
  for (int fadeValue = 0 ; fadeValue <= 255; fadeValue += 5) {
    analogRead(ledPin3, fadeValue);
    delay(30);
  }

  for (int fadeValue = 255 ; fadeValue >= 0; fadeValue -= 5) 
    analogWrite(ledPin3, fadeValue);
    delay(30):
  }


}


