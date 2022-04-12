/*
 Abstract: This program ranks quickSort, insertionSort and mergeSort on the tmeit takes them to
 sort a list of randomly generated values.User selects size and sorting order.
 */

#include <iostream>
#include <iomanip>
#include <vector> 
#include <cstdlib> 
#include <chrono>
#include <map>

using namespace std;
using chrono::high_resolution_clock;
using chrono::duration;

void print(vector<double> v);
/*
 Sorting algorithms with added boolean parameter
 
 if asc = true, algorithm sorts in ascending order
 if asc = false, algorithm sorts in descending order
 */
void swap(vector<double> &v, int i, int j );
int part(vector<double> &v,int p, int r,bool asc=true);
void quickSort(vector<double> &v,int p,int r,bool asc=true);
void insertSort(vector<double> &v,bool asc=true);
void merge(vector<double> &v,int p,int q, int r,bool asc=true);
void mergeSort(vector<double> &v,int p, int r, bool asc=true);

//return a vector with randomly filled parameters 
vector<double> getRandomVec(int size);
//helper functions to time how long it each algorithm takes
//returns times as a double 
double timeQuick(vector<double> &v,bool asc=true);
double timeMerge(vector<double> &v,bool asc=true);
double timeInsert(vector<double> &v,bool asc=true);

const int INSERT = 0; 
const int MERGE = 1; 
const int QUICK = 2; 
//calls all three helper function, writing values into a vector 
//returns vector with all 3 times, one for each algorithm
vector<double> getTimes(vector<double> v, bool asc=true);

int main()
{
    srand(time(0));
    //hold the total time for all three times
    vector<double> averages(3);
    averages[INSERT] = 0.0;
    averages[MERGE]  = 0.0;
    averages[QUICK]  = 0.0;
    
    int n;
    cout<<"Enter input size: ";
    cin >> n;
    //vector filled with n random values   //test sorting algorithms
//    vector<double> list = getRandomVec(n);
//    quickSort(list,0,n-1,true);
//    print(list);
//    exit(0);
    
    int asc;
    cout<<"========== Select Option for Input Numbers ===========\n";
    cout<<"\t 1. Ascending Order\n";
    cout<<"\t 2. Descending Order\n";
    cout<<"\t 3. Random Order\n";
    cout<<"Choose Option: "; cin>>asc;
    if(asc < 1 || asc > 3) {
        cerr<<"Invalid Sorting Option selected \n";
        exit(1);
    }
    if(asc == 2) asc = 0;// asc = false;
    if(asc == 3) asc = rand() % 2; //random
    
    map<int,string> run;
    run[0] = "1st";
    run[1] = "2nd";
    run[2] = "3rd";
    
    for(int i = 0; i < 3; i++){
        vector<double> list = getRandomVec(n);//generate random 
        vector<double> time = getTimes(list,asc);
        averages[INSERT] += time[INSERT];
        averages[MERGE]  += time[MERGE];
        averages[QUICK]  += time[QUICK];
        cout<<fixed<<setprecision(6)<<left;
        cout<<"======================== "<<run[i]<<" run ======================\n";
        cout<<"Insertion sort: "<<time[INSERT]<<" seconds\n";
        cout<<"Merge sort:     "<<time[MERGE] <<" seconds\n";
        cout<<"Quick sort:     "<<time[QUICK] <<" seconds\n";
        cout<<"=======================================================\n\n";
    }
    
    averages[INSERT] /=3.0;
    averages[MERGE] /=3.0;
    averages[QUICK] /=3.0;
    //sort averages
    vector<double> avgSorted = averages;
    insertSort(avgSorted);
    
    cout<<"======================= Ranking =======================\n";
    bool elected[3] = {false,false,false};
    for(int i = 0; i < 3; i++){
        cout<<"("<<i<<") ";
        if(avgSorted[i] == averages[INSERT] && !elected[INSERT]){
            cout<<"Insertion Sort\n";
            elected[INSERT] = true;
        }
        else if(avgSorted[i] == averages[MERGE] && !elected[MERGE]){
            cout<<"Merge Sort\n";
            elected[MERGE] = true;
        }
        else if(avgSorted[i] == averages[QUICK] && !elected[QUICK]){
            cout<<"Quick Sort\n";
            elected[QUICK] = true;
        }
    }
    cout<<"=======================================================\n";
    
    return 0;
}




void print(vector<double> v){
    for(int i = 0; i < v.size(); i++)
        cout<<v[i]<<' ';
    cout<<endl;
}
void swap(vector<double> &v, int i, int j ){
    double k = v[i];
    v[i] = v[j];
    v[j] = k;
}
int part(vector<double> &v,int p, int r,bool asc){
    int i = p-1;
    for(int j = p; j < r; j++){
        if(asc){
            if( v[j] < v[r]){
                i++;
                swap(v,i,j);
            }
        }else{
            if(v[j] > v[r]){
                i++;
                swap(v,i,j);
            }
        }
    }
    swap(v,i+1,r);
    return i+1;
}
void quickSort(vector<double> &v,int p,int r,bool asc){
    if ( p >= r) return;
    int q = part(v,p,r,asc);
    quickSort(v,p,q-1,asc);
    quickSort(v,q+1,r,asc);
}
void insertSort(vector<double> &v,bool asc){
    for(int j = 1; j < v.size();j++){
        double key = v[j];
        int i = j-1;
        if(asc){
            while( i >= 0 && v[i] > key ){
                v[i+1] =v[i];
                i--;
            }
        }else{
            while( i >= 0 && v[i] < key ){
                v[i+1] =v[i];
                i--;
            }
        }
        v[i+1] = key;
    }
    
}

void merge(vector<double> &v,int p,int q, int r,bool asc){
    int n = q-p;
    int m = r-q;
    vector<double> left,right;
    for(int i = 0; i <= n;i++)
        left.push_back(v[p+i]);
    for(int i = 1;i <= m;i++)
        right.push_back(v[q+i]);
    
    int MAX_INT = 2147483647;
    if(!asc) MAX_INT *=-1;
    left.push_back(MAX_INT);
    right.push_back(MAX_INT);
    
    int i = 0;
    int j = 0;
    for(int k = p; k <= r; k++){
        if(asc){
            if(left[i] <= right[j] ){
                v[k] = left[i];
                i++;
            }else{
                v[k] = right[j];
                j++;
            }
        }else{
            if(left[i] >= right[j] ){
                v[k] = left[i];
                i++;
            }else{
                v[k] = right[j];
                j++;
            }
        }
    }
}
void mergeSort(vector<double> &v,int p, int r, bool asc){
    if( p >= r) return;
    int  q = (p+r)/2;
    mergeSort(v,p,q,asc);
    mergeSort(v,q+1,r,asc);
    merge(v,p,q,r,asc);
}
vector<double> getRandomVec(int size){
    vector<double> v;
    for(int i = 0; i < size; i++){
        v.push_back( rand() % (size*10) );
    }
    return v;
}
double timeQuick(vector<double> &v,bool asc){
    auto t1 = high_resolution_clock::now();
    quickSort(v,0,v.size()-1,asc);
    auto t2 = high_resolution_clock::now();
    return duration<double>(t2-t1).count();
}
double timeMerge(vector<double> &v,bool asc){
    auto t1 = high_resolution_clock::now();
    mergeSort(v,0,v.size()-1,asc);
    auto t2 = high_resolution_clock::now();
    return duration<double>(t2-t1).count();
}
double timeInsert(vector<double> &v,bool asc){
    auto t1 = high_resolution_clock::now();
    insertSort(v,asc);
    auto t2 = high_resolution_clock::now();
    return duration<double>(t2-t1).count();
}
vector<double> getTimes(vector<double> v, bool asc){
    const vector<double> copy = v;// OG copy of data
    vector<double> time(3);
    time[0] = timeInsert(v,asc);
    v = copy; //change values back to orginal order
    time[1] = timeMerge(v,asc);
    v = copy; //change values back to orgininal order
    time[2] = timeQuick(v,asc);
    return time;
}
