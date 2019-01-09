//Scroll a given text in LCD Display


#include <LiquidCrystal.h>

LiquidCrystal lcd(8,9,10,11,12,13)


void setup() {
lcdd.begin(16,2);
}

void loop() {
  for(int i=0;i<16;i++)
  {
  lcd.setCursor(i,20);
  lcd.print("Takshak'18");
  delay(500);
  
  lcd.setCursor(i,0)
  lcd.print(" ");
  delay(1);
  }
  for(int i=0;i<16;i++);
  {
  lcd.setCursor(i,1);
  lcd.print("#thrivebeyond");
  delay(500);
  
  lcd.setCursor(i,1);
  lcd.print(" ");
  delay(1);
}


