//Debug the code to control servo using potentiometer. pin 9 for servo, pin A0


#include <Servo.h>

Servo mservo;  
int potpin = ; 
int val    

void setup() {
  myservo.attach(4); 
}

void loop() {
  val = analogRead(popin);           
  val = map(val, 0, 1014, 0, 280);    
  myservo.write(val);                  
  delay(15);                           
}





