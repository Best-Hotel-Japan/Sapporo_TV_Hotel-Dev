H_information: {                            // HnameTable酒店资料数组初始化

    var H_info = new Array();
    H_info["未知酒店"]=["未知酒店名","未知Cid","未知","未知Jid","en",[""]];

    H_info["豪华多米"]=["小樽豪华多米酒店","19600034","灯の湯ドーミーインPREMIUM小樽","1512022","en",[""]];
    H_info["福朋"]=["函馆福朋喜来登酒店","16047187","フォーポイントバイシェラトン函館","1611015","en",[""]];
    H_info["拉碧"]=["拉碧斯达函馆湾","6528127","ラビスタ函館ベイ","1611037","en",[""]];


}

H_RoomType_information: {                   // 各酒店房型资料数组初始化

    H_info["未知酒店"][5]["舒适日式房"]=["000088600","04禁，05"];      // 满足顺序查找
    H_info["未知酒店"][5]["日式房"]=["000188201","07禁，08"];      
    
    H_info["豪华多米"][5]["双人房"]=["367551008","03禁，01"]; 
    H_info["福朋"][5]["标准双床房"]=["154892293","11"];
    H_info["拉碧"][5]["双床房"]=["54743389","08禁，02"];


}