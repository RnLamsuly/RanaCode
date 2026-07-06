# LinK17 递归求波兰表达式
[题目链接](http://xmuoj.com/contest/362/problem/LinK17)

## 思路

每个运算符，都意味着我们要对其后面接的两个子表达式进行运算。由此我们发现运算波兰表达式的思路是**递归**。

每次递归，我们先读取运算符，然后获取其后两个表达式的值(这一步通过调用两次递归实现)，最后运算并返回。

特别地，如果我们传入的表达式不包含运算符，只有单个的数字，我们便将这种情况视为递归终止条件，直接返回字符串的浮点数值。

---

## 注意

可以使用 `atof(char*)` 来将字符串转换为浮点数。

---

## AC代码
```cpp
#include <iostream>
#include <stdlib.h>
#include <string.h>
using std::string;
 
double eval() {
    char s[100];
    scanf("%s", s); //读入第一个运算符/数字
    if (s[0] == '+' || s[0] == '-' || s[0] == '*' || s[0] == '/') { //为运算符，需要递归
        double a = eval();
        double b = eval();
        switch (s[0]) { //根据运算符对后面的两个表达式的返回值进行运算
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
        }
    }
    return atof(s); //递归终止
}
 
int main() {
    printf("%f\n", eval());
    return 0;
}
```