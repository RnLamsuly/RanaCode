# LinK22 算术表达式
[题目链接](http://xmuoj.com/contest/362/problem/LinK22)

## 思路

注意到表达式中有 $N$ 个数字，字符串共 $2N - 1$ 个字符，不难发现其中有 $N-1$ 个运算符，参与运算的整数均为一位数。

我们可以把所有连续相乘的项视为一组，通过循环将所有组累加即可实现表达式求值。

---

## 处理细节

表达式以数字结尾，循环中的累加只在遇到 `+` 时触发，因此最后一项不会被自动累加。有两种处理方式：一是在循环结束后手动累加末项；二是在原字符串末尾拼接 `+0`，使循环自动将末项纳入累加，省去额外判断。

---

## 注意

答案对 $10^9+7$ 取模，取模一定要在每次运算后都进行一次，否则会溢出。

---

## AC代码
```cpp
#include <iostream>
#include <string>
using namespace std;
 
const long long MOD = 1e9+7;
 
int main() {
    int n;
    string s;
    cin >> n >> s;
 
    long long ans = 0; //累加器，记录求和的结果
    long long temp = 1; //记录当前项累乘的值
 
    for (int i=0;i<s.length();++i) 
	{
		char c=s[i];
        if (c == '+') { //如果是加法，将当前项的值加入计数器，并清空当前项的记录值
            ans = (ans + temp) % MOD;
            temp = 1;
        } 
		else if (c>='1'&&c<='9') { //如果是数字，乘入当前项
            temp = (temp*(c-'0')) % MOD;
        }
    }
 
    ans = (ans + temp) % MOD; //最后一个字符是数字，不会触发加法条件，所以要单独处理
    //其实也可以在字符串末尾添加一个"+0"使得末项在循环中自动处理
    cout << ans << '\n';
 
    return 0;
}
```