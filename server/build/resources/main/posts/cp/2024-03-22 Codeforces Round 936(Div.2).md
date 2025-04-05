# 개요
본케도 블루에 올려놨지만 맨날 민트로 다시 떨어진다. 항상 잘보면 1700언저리 못보면 1500 정도 나와서 딱 민트 상위 블루 하위가 지금 나의 퍼포먼스라고 생각하면 될 듯하다. 하지만 나는 더 잘하고 싶다. 지금까지 귀찮아서 버추얼과 업솔빙을 소홀히 했는데 지금이라도 열심히 해보려한다. 목표는 정규라운드를 포함하여 일주일에 꼭 2번은 대회를 치고 업솔빙까지 블로그에 쓰는 식으로 해보려고 한다. 내가 퍼플에 가는 그 날까지 블로그에는 코드포스 관련 글만 올릴 듯 싶다.
오늘 대회는 2솔을 했다. 너무 슬프다 ㅠㅠ 하지만 내실력인걸 어떡하겠나...열심히해야지

# A. Median of an Array
배열의 원소에 1을 더하는 연산을 할 수 있다. 
이 때, 배열에 적절히 연산을 해서 처음으로 중간값을 바뀌게하는 연산 횟수를 구하고 싶다.

1. 먼저 중간값이 딱 하나면 그냥 거기에 1을 더해주면 된다. 
2. 하지만 중간값이 여러개라면 하나를 1올려도 다른 하나로 대체된다.
3. 따라서 정렬하고 (n+1)/2 이상의 index에서 중간값과 같은 값의 개수를 세면 된다.
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

void solv(){
    int n; cin >> n;
    vector<int> a(n);
    for(int i=0;i<n;i++) cin >> a[i];
    sort(a.begin(), a.end());
    int x = a[(n+1)/2-1];
    int cnt = 0;
    for(int i=(n+1)/2-1;i<n;i++){
        if(x == a[i]) cnt++;
    }
    cout << cnt << '\n';
}

int main(){
    fast_io
    int tt; cin >> tt;
    while(tt--) solv();
}
```

# B. Maximum Sum
배열이 있다. 
여기에 연산을 할 수 있는데 배열에서 가장 큰 부분합을 찾은 후에 그 값을 배열의 아무데나 추가하는 것이다.
이 연산을 k번 했을 때 모든 배열 원소의 합을 구하는 문제다. 

1. 음수밖에 없으면 더할 필요가 없다. 
2. 요소들의 합이 가장 큰 연속되는 subarray를 찾고 그 연속되는 subarray안에 넣는다.
3. 그렇게 k번 요소를 추가한 후 합을 계산한다.

2번은 [1912 연속합](https://www.acmicpc.net/problem/1912)의 아이디어로 dp로 구할 수 있다.
이 후, 최대 연속합을 x라고 하면 $\sum\limits_{i=1}^{k}x*2^{i-1}$ 이 추가된 요소가 된다.
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

const ll mod = 1e9+7;

void solv(){
    int n, k;
    cin >> n >> k;
    vector<ll> a(n+1), dp(n+1);
    for(int i=1;i<=n;i++) cin >> a[i];
    ll x = 0;
    dp[1] = max(0LL, a[1]);
    x = max(x, dp[1]);
    for(int i=2;i<=n;i++){
        dp[i] = max(dp[i-1] + a[i], a[i]);
        x = max(x,dp[i]);
    }
    
    ll add = x;
    for(int i=0;i<k-1;i++){
        add += x * 2LL;
        x *= 2LL;
        x %= mod;
        add %= mod;
    }
    for(int i=1;i<=n;i++){
        add += a[i];
        add %= mod;
    }
    cout << (add % mod + mod) % mod << '\n';
}

int main()
{
    fast_io 
    int tt; cin >> tt;
    while (tt--) solv();
}
```

# C. Tree Cutting
문제는 매우 간단하다. 트리의 간선을 끊으면 subtree가 2개 생긴다. 
이 때, 간선을 끊는 행위를 k번 한후 제일 작은 subtree의 크기가 제일 큰 경우를 구하면 된다.

먼저 분석해보면 아무리 잘 짤라도 답이 n/(k+1) 을 넘길 수는 없다.

일단 subtree가 제일 큰 경우를 구하면 되니까 이거는 binary search를 이용할 수 있다. 
솔직히 여기까진 생각했다. 
그리고 내가 정한 답이 되는가? 를 판단할 때는 그리디 알고리즘으로 하는데 여기를 어케해야하지 싶었다.

아이디어도 꽤 간단했다. 
트리를 쭉 보는데 서브트리가 내가 설정한 것보다 같거나 커지는 순간 뚝 끊어버리고 보면 된다. 
근데 이게 구현이 생각보다 까다롭다. 답을 봤는데 코드이해는 쉬웠는데 생각보다 구현이 어려웠다. 
ㅠㅠ
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

const int MAX = 1e5+1;
int n, k;
vector<int> G[MAX];
int res = 0, X = 0;

int dfs(int now, int par){
    int sz = 1;
    for(int nxt : G[now]){
        if(nxt == par) continue;
        sz += dfs(nxt, now);
    }
    if(X <= sz && now != par){
        sz = 0;
        res += 1;
    }
    return sz;
}

bool chk(int x){
    X = x;
    res = 0;
    int sz = dfs(1, 1);
    if(res > k || (res == k && sz >= x)) return true;
    return false;
}

void solv(){
    cin >> n >> k;
    for(int i=1;i<n;i++){
        int u, v; cin >> u >> v;
        G[u].push_back(v);
        G[v].push_back(u);
    }
    
    int lo = 0, hi = n/(k + 1) + 1;
    while(lo + 1 < hi){
        int mid = (lo + hi) >> 1;
        if(chk(mid)){
            lo = mid;
        }else{
            hi = mid;
        }
    }

    cout << lo << '\n';
    for(int i=1;i<=n;i++) G[i].clear();
}

int main()
{
    fast_io 
    int tt; cin >> tt;
    while (tt--) solv();
}
```
핵심은 서브트리 수를 관리하다가 아래서 부터 0으로 만들어버리는 것이다. 
재귀 원리를 이용한 정말 좋은 테크닉이다.

# D. Birthday Gift
문제를 간단히 요약하면
배열이 주어지고 이를 최대한 많은 그룹으로 나눌건데
각 그룹을 xor한 값들을 모아서 or연산한 값이 특정한 값 x를 넘어서는 안된다. 
그렇게 할 수 있는 가장 많은 그룹의 수를 구하면 되는 것이다.

그룹을 많게하려면 배열을 잘게잘게 쪼개는 것이 이득이지만 잘게 쪼갤 수록 or연산했을 때 값이 커질 확률이 높을 것이다. 
모든 구간을 전수조사하려면 $2^{100000}$ 의 시간이 걸리니 절대 불가능이다. 
배열을 쭉 보면서 확인하는 수 밖에 없다. 

일단 내가 생각했던 아이디어를 되짚어보면
1. 각 구간의 xor값은 누적합으로 $O(30)$ 만에 구할 수 있다.
2. 그리고 map을 이용한 dp처럼 해결하는 것이다.
3. 또는 앞에서 부터 보면서 그리디하게 끊을 수 없을까 고민하기도 했다.
근데 내 풀이는 map에 넣는 연산도 너무 많이하고 심지어 예제도 잘 안나왔다. 
x보다 작은 값을 모두 검사할 수도 없다. (x가 너무 큼)
그리고 앞에서 부터 끊는 건 안될 것 같았다.

정답은... 3번풀이를 bit별로 수행하는 것이다. 
가장 큰 비트부터해서 조건을 만족하면 그냥 살리고 아니면 나눠버린다. 이 과정을 끝 비트까지 하면된다. 
가면 갈 수록 그룹이 계속 합쳐져 작아진다. 그래서 중간에 성공하면 그것이 답일 것이다. 

```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

void solv(){
    int n, x; cin >> n >> x;
    x += 1;
    vector<int> a(n+1);
    for(int i=1;i<=n;i++) cin >> a[i];
    int res = -1;
    for(int i=30;i>=0;i--){
        vector<int> b;
        b.push_back(0);
        bool zero = true; // 이번 비트가 0인지 아닌지
        for(int j=1;j<a.size();j++){
            if(zero){
                b.push_back(a[j]); // 0이면 일단 추가(그룹이 많을 수록 좋음)
            }else{
                b.back() ^= a[j]; // 1이면 0을 없애주기 위해 xor해줌
            }
            if(a[j] & (1 << i)){ // 1이면 zero의 상태가 바뀜
                zero ^= 1;
            }
        }
        if(x & (1<< i)){ // 이번 비트가 1이면 뒤에 비트에서 걸리는지 확인해야함
            if (zero)
                res = max(res, (int)b.size()-1);
        }else{
            if (!zero){
                cout << res << '\n';
                return;
            }
            a = b;
        }
    }
    cout << res << '\n';
}

int main(){
    fast_io 
    int tt; cin >> tt;
    while (tt--) solv();
}
```
 - 구현할 때 테크닉
	 - x를 1키워서 작은 경우만 확인한다.
	 - 내가 1-based 로 해서 구현이 좀 별로였다...
# 마무리
솔직히 아직도 구현 실력이 많이 부족하다. 
그 이유는 내가 틀린 문제를 다시 보지 않는 정말 쓰레기 같은 습관을 가지고 있기 때문이다. 
코포 실력이 늘려면 코포를 많이 치는게 좋은데 나는 버추얼도 안풀면서 퍼플을 가고 싶다는 것 자체가 참 욕심쟁이다.
이제 부터 2가지를 꼭해보겠다.
1. 버추얼 포함 일주일에 2번 코포 치기
2. 2000이하 rating 문제는 무조건 upsolving 하기
퍼플 갈 때까지 2가지 꼭 지키자 화이팅!!