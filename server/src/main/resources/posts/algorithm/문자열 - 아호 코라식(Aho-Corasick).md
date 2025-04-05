# 개요
문자열 알고리즘은 어렵다. 
트라이 부터 조금 어려워지다가 KMP의 failure function, 접미사 배열 등이 나오면서 대가리가 깨진다. 
하나씩 차근차근 정리를 해보려고 한다. 
지금 클래스 8을 풀다가 [문자열 집합 판결](https://www.acmicpc.net/problem/9250)이라는 문제에서 막혔는데 태그를 까보니 아호 코라식이 써 있었다. 이 문제를 계기로 아호 코라식을 정리해 보겠다. 

# 언제 쓰지?
일단 KMP같은 경우엔 Hay(건초)에서 Needle(바늘)이 몇 개, 어디에 있는지 찾을 수 있다. 
인터넷에서 ctrl + f를 누르고 어떤 패턴의 문자열을 찾는 식이다. 
그니깐, 하나의 패턴만 찾을 수 있다는 것이다. 
그럼 어떤 큰 문자열에 dosa, was, hi 등의 문자열이 있는지 확인하려면 KMP 알고리즘으로는 dosa를 needle로 한번, was를 needle로 또 한번, 마지막으로 hi를 needle로 총 3번의 KMP를 돌릴 것이다. 

아호 코라식은 좀 다르다. 
**여러 패턴들이** 어떤 큰 문자열에 있는지 한번에 확인할 수 있다. 

# 시간 복잡도
아직 공부를 마치지 않았지만
어떤 문자열 S에서 $w_1,w_2,\cdots, w_n$ 의 문자열이 있는지 확인한다고 하면
$$
O(len(S) + len(w_{1})+\cdots+len(w_{n}))
$$
이 된다. 
KMP가 쭉 한번만 훑으면서 검사하는 것과 굉장히 비슷한 시간복잡도를 가진다.

# 과정

### 알고리즘의 단계

1. **트라이 생성**:
   - 주어진 모든 **패턴 문자열**을 사용하여 **트라이**를 만듭니다.

2. **실패 링크 생성**:
   - BFS(너비 우선 탐색)를 사용하여 트라이를 탐색하며 **실패 링크**를 설정합니다. 루트 노드의 자식 노드의 실패 링크는 루트 노드를 가리키도록 하고, 나머지 노드들은 그 부모 노드의 실패 링크를 따라 설정합니다.

3. **검색(Search)**:
   - 텍스트 문자열을 한 문자씩 읽으면서 트라이를 탐색합니다.
   - 매칭이 실패하면 실패 링크를 따라가며 매칭을 계속 시도합니다.
   - 매칭이 성공하면 출력 링크를 따라가며 결과를 출력합니다.

### 예시

패턴: \["he", "she", "his", "hers"\]

트라이 구성:
```
          (root)
         /  |  \
        h   s   h
        |       |
        e       i
       / \       \
      r   s       s
     /           /
    s           h
```

실패 링크 설정 후:
```
          (root)
         /  |  \
        h   s   h
        |   |   |
        e   e   i
       / \  |    \
      r   s s     s
     /       |   /
    s        h  h
```

텍스트: "ushers"

탐색 과정:
1. "u" -> 매칭 실패, 루트로 돌아감.
2. "s" -> 매칭 성공, 다음 문자로 이동.
3. "h" -> 매칭 성공, 다음 문자로 이동.
4. "e" -> 매칭 성공, 다음 문자로 이동.
5. "r" -> 매칭 성공, 다음 문자로 이동.
6. "s" -> 매칭 성공, 패턴 "hers" 매칭됨.

이와 같은 방법으로 아호 코라식 알고리즘은 효율적으로 다수의 패턴 문자열을 검색할 수 있다.

핵심적인 부분은 
1. 매칭을 성공했을 때 갈 곳(go)
2. 매칭을 실패(fail) 했을 때 갈 곳
3. 패턴이 다 나왔을 때 체크
을 잘 구현해야하는 것이다. 

이 때 실패는 KMP의 실패함수와 논리구조가 똑같다. 
내가 봐야하는 부분부터 볼 수 있게끔 도와준다.

# 구현
구현은 [라이님 블로그](https://m.blog.naver.com/kks227/220992598966)를 참고했다. (진짜 초갓갓 블로그 중 하나다)

### Trie
먼저 트라이 구현이다.
```cpp
struct Trie{
    vector<Trie *> go; //성공
    Trie *fail; // 실패
    bool output; // 출력

    Trie(){
        go = vector<Trie * > (26, nullptr);
        output = false;
    }

    ~Trie(){
        for(int i=0;i<26;i++) if(go[i]) delete go[i];
    }

    void insert(const string & pattern, int idx){
        if(idx == pattern.size()){
            output = true;
            return ;
        }
        int nxt = pattern[idx] - 'a';
        if(!go[nxt]){
            go[nxt] = new Trie;
        }
        go[nxt] -> insert(pattern, idx + 1);
    }
};
```
이 트라이의 노드는 go, fail, output으로 구현이 되어있다.

### fail
BFS를 통해 실패함수를 만든다. 처음에 root노드가 들어오고 다음으로 갈 수 있다고 치면 그건 실패함수가 아니라 성공으로 이동해야하니까 넘긴다. 

지금 어떤 노드 (nd)에서
패턴이 없어서 nxt(go)가 없으면 fail로 어디로 갈지 정해야한다. 
nxt가 있을 때 까지 빠꾸 친다.(fail을 계속 따라간다)
그럼 nxt가 있으면 nxt -> go\[nd\] 이 fail이 가리키는 곳이 된다. (지금 제가 한 말이 뭔가 가독성이 안좋은듯 ㅋㅋ)

근데 만약에 실패함수가 가리키는 곳이 어떤 패턴의 끝이라고 해보자. 
그럼 그 패턴을 포함한다는 것이니까 nxt는 어떤 패턴을 포함한다라고 생각하면 된다.
1. BFS
```cpp
// 실패함수 만들기
    queue<Trie *> Q;
    rt ->fail = rt;
    Q.push(rt);
    while(!Q.empty()){
        Trie * nd = Q.front();
        Q.pop();

        for(int i=0;i<26;i++){
            Trie * nxt = nd->go[i];
            if(!nxt) continue;

            if(nd == rt) nxt -> fail = rt;
            else{
                Trie *dest = nd->fail;
                while(dest != rt && !dest->go[i]){
                    dest = dest ->fail;
                }
                if(dest -> go[i]) dest = dest->go[i];
                nxt -> fail = dest;
            }

            if(nxt -> fail -> output) nxt -> output = true;

            Q.push(nxt);
        }
    }
```

### 다양한 패턴이 있는지 확인하는 작업
어떤 string s에 대해 패턴이 있는지 확인하는 부분이다.
root에서 시작해서 s따라 쭉쭉 따라가면서 cur -> output이 참이면 성공이다.
```cpp
int M; cin >> M;
    while(M--){
        string s; cin >> s;
        bool ok = false;
        Trie *cur = rt;
        for(char c : s){
            int nd = c - 'a';
            while(cur != rt && !cur->go[nd]){
                cur = cur -> fail;
            }
            if(cur->go[nd]) cur = cur -> go[nd];
            if(cur -> output){
                ok = true;
                break;
            }
        }
        cout << (ok ? "YES\n" : "NO\n");
    }
```


# 결론
구현이 굉장히 깔끔하고 KMP의 Trie 버전이다. 
좀 멋있는 것 같다. 
KMP도 Trie 자료구조도 다 어려웠는데 그 둘을 합친 느낌의 알고리즘이라니... 어렵지만 재밌다.
그래도 여러 패턴과 매칭을 할 때 쓴다는 것은 확실히 알았으니 문제에 적용할 수 있을 것 같다. 

다음엔 suffix array를 좀 정리해보려고 한다.
저번에 하려다가 뭔소린지 잘 모르겠어서 그냥 안했었는데 좀 해라..나란 놈아
