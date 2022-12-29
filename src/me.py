class Solution:
    def dailyTemperatures(self, temperatures: list) -> list:
        answer = []
        res = [0] * len(temperatures)
        print (res)
        for i in range(len(temperatures)):
            flag,count = 0,0
            afterTemp = temperatures[i+1:]
            for j in range(len(afterTemp)):
                print(temperatures[i+1:])
                # [73,74,75,71,69,72,76,73]
                # Output: [1,1,4,2,1,1,0,0]

                if temperatures[i] > afterTemp[j]:
                    count+=1
                if temperatures[i] < afterTemp[j]:
                    count+=1
                    print(f'the number is {temperatures[i]} and the warmer day is {afterTemp[j]} and the count is {count}')
                    answer.append(count)
                    res[i] = count
                    flag = 1
                    break
            if flag == 0:
                answer.append(0)
        print(answer)
        print(res)
        return answer
    

mo = Solution()
mo.dailyTemperatures([73,74,75,71,69,72,76,73])
                    