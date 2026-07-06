# LinK03 人的周期
[题目链接](http://xmuoj.com/contest/362/problem/LinK03)

## 思路

依旧是一道枚举题。我们可以以一个周期为基准，枚举这个周期的峰值并判断在另外两个周期中这一天是否位于峰值。

---

## 处理细节

如果从 $d+1$ 开始逐天枚举，最多可能需要尝试 $21252$ 天。我们可以先将 $d$ 对齐到下一个体力周期峰值日，即令 $d \gets d + PP - (d - p) \bmod PP$，之后每次步进 $PP = 23$ 天。这样只需检查体力峰值日是否同时为情商和智商峰值日，枚举次数大幅减少。

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