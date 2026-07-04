# LinK03 人的周期
[题目链接](http://xmuoj.com/contest/362/problem/LinK03)

## 思路

依旧是一道枚举题。我们可以以一个周期为基准，枚举这个周期的峰值并判断另外在两个周期中这一天是否位于峰值。

---

## 注意

---

## AC 代码
```cpp
#include<iostream>
 
const int PP=23, EP=28, IP=33;
 
void output(int n,int d)
{
	printf("Case %d: the next triple peak occurs in %d days.\n",n,d);
}
 
bool check(int p, int e, int i, int d) //检测某一天是否同时为三个周期的峰值
{
	p=d-p;
	e=d-e;
	i=d-i;
	return (p%PP==0 && e%EP==0 && i % IP==0);
}
 
void Enu(int p, int e, int i, int d, int t)
{
	int ori=d;
	d+= PP - (d-p)%PP; //将d与P周期峰值对齐
	for(; !check(p,e,i,d); d+=PP); //开始枚举
	output(t,d-ori);
}
 
int main()
{
	int t=0;
	while(true)
	{
		int p,e,i,d;
		scanf("%d%d%d%d",&p,&e,&i,&d);
		if(p==-1)return 0;
		Enu(p,e,i,d,++t);
	}
}
```