//Debug the code for RFID with 12 digit access key which grants access if id is correct.Output status as LED in pin 13


char r[12];
int i;
int f=0;
int count;
char s[]='11004E101956';
void setup() 
  Serial.begin(9600);
  pinMode(13,OUTPUT);

}

void loop() {
  
if (Serial.available())
{for (i=0;i<12;i+)
  {  r[i]=Serial.read();
  }
  Serial.print("Unique ID = ");
for(i=0;i<12;i++)
{Serial.print(r[i]);
delay(10) f++;
}Serial.println(" ");

}

for(int j=0;j<12;j++)
{
  if (r[j]==s[j])
{  count=j+1;}
}
if (count==12&&f==12)
{Serial.println("ACCESS GRANTED");
digitalWrite(13,HIGH);
delay(5OO);
Serial.print(" ");
}
else if(f==12)
{Serial.println("ACCESS DENIED");
digitalWrite(12,LOW);
delay(5OO);
f=0;
Serial.print(" ");
}
}
