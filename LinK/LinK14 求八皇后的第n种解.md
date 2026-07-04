# LinK14 求八皇后的第n种解
[题目链接](http://xmuoj.com/contest/362/problem/LinK14)

## 思路

思路与上一题一样。

由于我们枚举数字时从小到大枚举，所以结果的顺序一定是字典序排列的。等长的升字典序数字串作为整数的时候自然符合升序。

仅需添加一个全局变量统计当前得到的是第几个结果就行。

---

## AC代码
```cpp
#include <iostream>
#include <string.h>
using std::string;
using std::cin;
using std::cout;
int n,flag[15],get[15],ans[100];
int N;
string s;
int cnt; //用cnt记录当前的解是第几个解
inline void w()
{
	cnt++; //获得新解的时候cnt增大1
    //这里是为了节省内存将答案用一个整数存储
	for(register int i=1;i<=n;i++) ans[cnt]=10*ans[cnt] +get[i]; 
    return;
} 
inline void dfs(int k)
{
	if(k==n)
	{
		w();
		return;
	}
	for(register int i=1;i<=n;i++)
	{
		if(flag[i])continue;
		int con=0;	
		for(int j=1;j<=k;++j)
		{
			if(k+1-j==i-get[j])
			{
				con=1;
				continue;
			}
			if(j-k-1==i-get[j])
			{
				con=1;
				continue;
			}
		}
		if(con)continue;
		flag[i]=1;
		get[k+1]=i;
		dfs(k+1);
		flag[i]=0;
	}
}
int main()
{
	n=8; // 这题求的是八皇后解的个数，所以直接将8赋值给n
	dfs(0);
	int t;
	cin>>t;
	while(t--)
	{
		cin>>N;
		cout<<ans[N]<<'\n';
	}
	return 0;	
}
```