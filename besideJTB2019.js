var debug = 0;
var $body = $('body');
var gName1 = "";            // JTB氏名報告
var report_summary;         // 集計草稿

var running_water_record = new Array(1);
running_water_record[0] = new Array(20);
for ( var col = 0; col < 20; col++ ){ running_water_record[0][col] = "###"; }

$(document).ready(function(){
setTimeout(function(){

    debug = 0.81;               
    navigator.clipboard.readText()
    .then(text => {
        
        var pasteStr = text;
        var pasteStrJTB = "";

        // 保留功能：从 新版本EBK订单页面 回到 旧版本EBK订单页面
        if (pasteStr.match(/dltOrderDetails/)) { 
            var oldEBK_URL = pasteStr.replace("dltOrderDetails","OrderDetails"); 
            var oldEBKwindow = window.open (oldEBK_URL, 'oldEBKwindow',
            'fullscreen=yes, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=yes');
            
            window.close();
        }

        var gName = new Array();    // 用于存放所有客人姓名，从入住人1开始
        gName[0] = "";
        var gNameShow = "";         // 把所有名字显示成一行
        var HnameSummary = "未知中文名";
        var HnameJTBcode = "??????";
        var JTBRoomTypecode = "??";
        var JTBTotalPrice = "$$$";
        var priceProfit = 0;
        var orderProfit = 0;
        
        Hotel_information: {                            // HnameTable酒店资料数组初始化

            var HnameTable = new Array();    // 在 H_info.js(非加密) 中定义另外的全局变量
            debug = 2.1;

            HnameTable["塔娃"]=["星野TOMAMU度假村塔娃大酒店","3638706","星野リゾートトマム・ザ・タワー","1578006","en",[""]];
            HnameTable["Riso"]=["北海道星野Tomamu Risonare大酒店","5436026","星野リゾートリゾナーレトマム","1578020","en",[""]];
            HnameTable["奥入濑"]=["星野集团　奥入濑溪流酒店","39412264","星野リゾート奥入瀬渓流ホテル","2120007","en",[""]];
            HnameTable["津轻"]=["星野集团　界 津轻","45417901","星野リゾート界津軽","2144011","en",[""]];

            HnameTable["日航"]=["JR札幌日航酒店","6464536","JRタワーホテル日航","1529113","en",[""]];
            HnameTable["格拉斯丽"]=["格拉斯丽札幌酒店","2377490","ホテルグレイスリー札幌","1529024","en",[""]];
            HnameTable["北口"]=["MYSTAYS 札幌站北口酒店","6514178","ホテルマイステイズ札幌駅北口","1529121","en",[""]];
            HnameTable["世纪皇家"]=["札幌世纪皇家酒店","6507655","センチュリーロイヤルホテル札幌","1529023","en",[""]];
            HnameTable["克罗斯"]=["札幌克罗斯酒店","6608499","クロスホテル札幌","1529120","en",[""]];

            HnameTable["第一滝本"]=["第一滝本馆","6529923","登別第一滝本館","1558001","en",[""]];
            HnameTable["泷本酒店"]=["泷本酒店","18444285","滝本イン","1558013","en",[""]];
            HnameTable["登别格兰"]=["登别格兰酒店","6527760","登別グランドホテル","1558002","en",[""]];
            HnameTable["仙境"]=["仙境酒店","6528109","ホテルまほろば","1558007","en",[""]];

            HnameTable["雅亭"]=["雅亭酒店","16828803","名湯の宿パークホテル雅亭","1558006","en",[""]];
            HnameTable["石水亭"]=["登别石水亭温泉酒店","18445392","登別石水亭","1558005","en",[""]];
            HnameTable["旅亭花"]=["旅亭花由良日式旅馆","19455731","登別温泉旅亭花ゆら","1558018","en",[""]];
            HnameTable["汤本"]=["登别汤本温泉酒店","19865420","ホテルゆもと登別","1558017","en",[""]];
            HnameTable["泷乃家"]=["登别温泉乡 泷乃家","45948763","登別温泉滝乃家","1558004","en",[""]];
            HnameTable["玉乃汤"]=["滝乃家别馆玉乃汤","19865427","滝乃家別館玉乃湯","1558019","en",[""]];

            HnameTable["湖畔亭"]=["洞爷湖畔亭酒店","19678239","洞爺湖温泉湖畔亭","1570022","en",[""]];
            HnameTable["洞爷观光"]=["洞爷观光酒店","5243404","洞爺観光ホテル","1570002","en",[""]];

            
        }
        Hotel_RoomType_information: {                   // 各酒店房型资料数组初始化
            
            HnameTable["塔娃"][5]["家庭双床房"]=["247269138","08"];
            HnameTable["塔娃"][5]["家庭三人房"]=["247730310","09"];
            HnameTable["塔娃"][5]["家庭四人房"]=["245448900","05"];
            HnameTable["Riso"][5]["双人间套房"]=["205308064","03"];
            HnameTable["Riso"][5]["四人间套房"]=["586756234","04"];
            HnameTable["奥入濑"][5]["现代房"]=["435614879","03"];
            HnameTable["奥入濑"][5]["双床房"]=["435616633","04"];
            HnameTable["奥入濑"][5]["温雅日式房"]=["435616730","05"];
            HnameTable["奥入濑"][5]["山间溪景日式房"]=["435616964","06"];
            HnameTable["津轻"][5]["西式房"]=["527991114","03"];
            HnameTable["津轻"][5]["日式房带客厅"]=["528576167","04，05"];
            HnameTable["津轻"][5]["和洋式房"]=["527992726","05"];

            HnameTable["日航"][5]["中等双床房"]=["331766732","08"];
            HnameTable["格拉斯丽"][5]["小型双人床房"]=["93833398","06"];
            HnameTable["北口"][5]["高级双床房"]=["211699020","06"];
            HnameTable["世纪皇家"][5]["标准双床房"]=["136799190","06禁，03"];
            HnameTable["克罗斯"][5]["城市双床房"]=["204683755","04"];

            HnameTable["第一滝本"][5]["标准日式房"]=["55430775","03"];
            HnameTable["第一滝本"][5]["高级双床房"]=["358340703","08"];
            HnameTable["第一滝本"][5]["高级日式房"]=["368592481","09"];
            HnameTable["泷本酒店"][5]["双床房"]=["178809828","01"];
            HnameTable["登别格兰"][5]["本馆传统日式房"]=["371989231","06"];
            HnameTable["登别格兰"][5]["标准双床房"]=["371986548","03"];
            HnameTable["登别格兰"][5]["舒适双床房"]=["401010768","17"];
            HnameTable["登别格兰"][5]["客房-带露台"]=["451458996","10，11"];
            HnameTable["仙境"][5]["高级日式房"]=["95093532","02"];
            HnameTable["仙境"][5]["洋式房"]=["184150935","03"];

            HnameTable["雅亭"][5]["日式房"]=["157723871","02，1A"];
            HnameTable["雅亭"][5]["和洋式房"]=["157724390","04，1B"];
            HnameTable["雅亭"][5]["西式房"]=["370038745","03"];
            HnameTable["石水亭"][5]["和室房-樱馆"]=["181555540","13禁，12，02"];
            HnameTable["石水亭"][5]["和室房-银杏馆"]=["181553734","07禁，05"];
            HnameTable["石水亭"][5]["和洋室房-辛夷馆"]=["181557606","06禁，03"];
            HnameTable["旅亭花"][5]["日式房-带露天"]=["507755385","04禁，02"];      // 满足顺序查找
            HnameTable["旅亭花"][5]["日式房"]=["507753659","01"];
            HnameTable["汤本"][5]["豪华日式房"]=["569488657","04禁，05"];           // 满足顺序查找
            HnameTable["汤本"][5]["日式房"]=["569488243","07禁，01"];
            HnameTable["汤本"][5]["和洋式房"]=["569488657","04禁，05"];
            HnameTable["泷乃家"][5]["和洋室房-带露天"]=["566730024","01"];
            HnameTable["玉乃汤"][5]["日式四人房"]=["541697061","01"];

            HnameTable["湖畔亭"][5]["山景和式房"]=["209399337","05，1A"];
            HnameTable["湖畔亭"][5]["湖景和式房"]=["209399435","02"];
            HnameTable["湖畔亭"][5]["湖景和洋式房"]=["185088605","01"];
            HnameTable["洞爷观光"][5]["湖景和式房"]=["189685202","01，02"];
            

        }

        ctripOrderInfo_extracting_block: {

            var ctripOrderThing=new Array();
            
            if (pasteStr.match(/城市\/酒店/)) {

                //新版的订单页面 from 2019.6.01

                var regExp_ctripOrderRef=/订单号\s*(\d{11}).*(.[\u4E00-\u9FFF])[N\s][o\s].*\s*订单.*\s*付款.*\s*分销.*\s*总底价\s*JPY\s*(\d+)\s/;
                // old regExp 20190601: 订单号\s+(\d{10}).*([\u4E00-\u9FFF]{2})[N\s][o\s].*\s*.+\s+.+\s+总底价\s+JPY\s+(\d+)\s
                ctripOrderThing[0]=pasteStr.match(regExp_ctripOrderRef);
                var ctripOrderRef=RegExp.$1;        //携程单号
                var ctripOrderType=RegExp.$2;       //订单类型
                var ctripOrderPrice=RegExp.$3;      //总金额

                var regExp_ctripOrderReserv=/订单号\s*\d{10}.*保留房/;
                var reserv_Order = false;
                if ( pasteStr.match(regExp_ctripOrderReserv) ){ reserv_Order = true; }

                //var regExp_ctripOrderType=/订单号\s+\d{10}.*([\u4E00-\u9FFF]{2})[N\s][o\s]/;    //订单类型\s+(..)
                //ctripOrderThing[1]=pasteStr.match(regExp_ctripOrderType);

                //var regExp_ctripOrderPrice=/总底价\s+JPY\s+(\d+)\s/;    //订单金额\s+JPY(.+)\s
                //ctripOrderThing[2]=pasteStr.match(regExp_ctripOrderPrice);
                
                var regExp_ctripOrderHotel=/订单中心\> 订单详情\s+(.+)\(/;    //酒店名称\s+(.+)\(
                ctripOrderThing[3]=pasteStr.match(regExp_ctripOrderHotel);
                var ctripOrderHotel=RegExp.$1;
                
                // [\w：]{0,3}([- 是为了对应类似于「床型 DW：和洋室房-带露天」 的情况
                var regExp_ctripOrderRoomtype=
/房型\/间数\/床型\s+[\w：]{0,3}([-\u4E00-\u9FFF]+).+([\u4e00-\u9fa5]早|早\+晚餐).+\s+(\d+)\s+间\s+房型ID.+ (\d+) .+\s+入离日期\s+(20\d\d\W\d\d\W\d\d).+(20\d\d\W\d\d\W\d\d).+(\d+)\s*晚/;
                ctripOrderThing[4]=pasteStr.match(regExp_ctripOrderRoomtype);
                var ctripOrderRoomtype=RegExp.$1;    //房型
                var ctripOrderMeals=RegExp.$2;       //餐食
                var ctripOrderRooms=RegExp.$3;       //间数
                var ctripOrderSaleTypeID=RegExp.$4;  //售卖房型ID
                var ctripOrderDate1=RegExp.$5;       //入住日期
                var ctripOrderDate2=RegExp.$6;       //离店日期
                var ctripOrderNights=RegExp.$7;      //晚数

                var ctripOrderRoomtypeSub = "";
                if ( pasteStr.match(/(\([\u4E00-\u9FFF]{1,3}[馆楼塔翼]\))/) ){
                    ctripOrderRoomtypeSub = RegExp.$1;
                }

                var d1 = new Date(ctripOrderDate1);
                var d2 = new Date(ctripOrderDate2);
                //var ctripOrderNights = parseInt((d2 - d1) / (1000 * 3600 * 24)); 
                var getDayOfWeek = ['日','月','火','水','木','金','土'];
                var Date1_dayName = getDayOfWeek[d1.getDay()];                        

                var regExp_ctripOrderEach_Case1=/房型\/间数\/床型\s+.+(.人入住)/;
                var regExp_ctripOrderEach_Case2=/房型\/间数\/床型\s+.+([双大中标][人床准][床房])/;
                var ctripOrderEachRoom;
                if ( pasteStr.match(regExp_ctripOrderEach_Case1) ){     
                    ctripOrderEachRoom=RegExp.$1;
                } else if ( pasteStr.match(regExp_ctripOrderEach_Case2) ){      
                    ctripOrderEachRoom="二人入住";
                } else {
                    ctripOrderEachRoom="？人入住";
                }
                
                //var regExp_ctripOrderDate=/入离日期\s+(20\d\d\W\d\d\W\d\d).+(20\d\d\W\d\d\W\d\d).+(\d+)\s*晚/;
                //ctripOrderThing[5]=pasteStr.match(regExp_ctripOrderDate);

                //var regExp_ctripOrderRooms=/\s+(\d+)\s+间\s+房型ID/;        //预订间数\s+(\d+)
                //ctripOrderThing[6]=.match(regExp_ctripOrderRooms);      
                
                var regExp_ctripOrderPeoples=/入住人\s+([\/\,\w ]+)\s+(\d+)\s+人/;       //入住人数\s+(\d+)
                ctripOrderThing[7]=pasteStr.match(regExp_ctripOrderPeoples);
                var GuestnameLine=RegExp.$1;
                var ctripOrderPeoples=RegExp.$2;
                //ctripOrderPeoples是订单通知人数。姓名个数 ≤ 订单通知人数 ≤ 实际入住人数 ≤ 预订可住人数

                GuestnameLine=GuestnameLine.replace("VIP ","");
                var GuestnameList=GuestnameLine.split(",");
                //转换成jtbGuestName以护照格式为准：去空格，改大写，姓与名中间的/改为半角空格
                gName1=GuestnameList[0];
                gName1=gName1.toUpperCase().replace('/','_');
                gName1=gName1.replace(/\W/g,"").replace('_',' ');        
                
                for ( var i = 0 ; i < GuestnameList.length ; i++ ){
                    //GuestnameList[i] = GuestnameList[i].replace("入住人","*");
                    gName[1+i] = GuestnameList[i].toUpperCase().replace(" ","");    // 删掉一个空格而不是全部，提高MS报告的可读性
                    gNameShow = gNameShow + "　*" + gName[1+i];
                }                        

                var regExp_ctripOrderDailyPrice=/\s(\d\d-\d\d\(.\))\s+JPY(\d+)/g;        //每日房价
                // ctripOrderThing[8]=pasteStr.match(regExp_ctripOrderDailyPrice);
                var DailyDate_list = new Array();         
                var DailyPrice_list = new Array(); 
                var indexD = 0;
                pasteStr.replace(regExp_ctripOrderDailyPrice,function($0,$1){
                    DailyDate_list[1+indexD] = arguments[1];
                    DailyPrice_list[1+indexD] = arguments[2];
                    indexD++;
                });

                //var regExp_ctripOrderMeals=/([\u4e00-\u9fa5]早|早\+晚餐)/;
                //ctripOrderThing[8]=.match(regExp_ctripOrderMeals);      

                //var regExp_ctripOrderGuestname=/入住人\d+\s+([\w ]+\/[\w ]+)/g;
                //ctripOrderThing[9]=pasteStr.match(regExp_ctripOrderGuestname);      // ctripOrderThing[9]已经是数组了!

                var regExp_ctripOrderSpecialrequest=/特殊要求 +(.*)\s/;
                ctripOrderThing[10]=pasteStr.match(regExp_ctripOrderSpecialrequest);
                var ctripOrderSpecialrequest=RegExp.$1;
                //内容可能很多，只是展示出来，然后提供高階層等等标签供复制选用

            } else {

                //旧版的订单页面

            }
        
        }
        
        Key_Info_treatment: {                           // 搜寻酒店资料数组 预处理小窗口显示内容

            // 酒店索引的搜索
            //// ver2018
            // for ( var Hcheck=0; Hcheck<90; Hcheck++ ){
            //     var thisHotelInfo = HnameTable[Hcheck];
            //     if ( HHHHname.match(thisHotelInfo[0]) ){ 
            //         HnameSummary = thisHotelInfo[1];        //HnameSummary仅为了适用于集計草稿，在2019版中更改为中文名全称
            //         HnameJTBcode = thisHotelInfo[4];
            //         break; 
            //     } 
            // }
            //// ver2018 over
            for (var Hx in HnameTable) {            // Hx 是酒店识别名称
                if ( ctripOrderHotel.match(Hx) ){ 
                    HnameSummary = HnameTable[Hx][0];
                    HnameJTBcode = HnameTable[Hx][3];
                    for (var TYPEx in HnameTable[Hx][5]) { 
                        if ( ctripOrderRoomtype.match(TYPEx) ){ 
                            //alert("　订单要求 :　" + Hx + " 酒店  ➔  " + TYPEx + " 房型\n　建议使用 :　JTB室タイプ　" + HnameTable[Hx][5][TYPEx][1]); 
                            JTBRoomTypecode = HnameTable[Hx][5][TYPEx][1];
                            break;     
                        }
                    }
                    break; 
                } 
            }          
            if ( HnameSummary == "未知中文名" ){    // 在本地酒店资料中没有找到

                for (var Hy in H_info) {            // Hy 是 H_info.js 酒店识别名称
                    if ( ctripOrderHotel.match(Hy) ){ 
                        HnameSummary = H_info[Hy][0];
                        HnameJTBcode = H_info[Hy][3];
                        Hx = Hy;
                        for (var TYPEy in H_info[Hy][5]) { 
                            if ( ctripOrderRoomtype.match(TYPEy) ){ 
                                //alert("　订单要求 :　" + Hy + " 酒店  ➔  " + TYPEy + " 房型\n　建议使用 :　JTB室タイプ　" + H_info[Hy][5][TYPEy][1]); 
                                JTBRoomTypecode = H_info[Hy][5][TYPEy][1];
                                TYPEx = TYPEy;
                                break;     
                            }
                        }
                        break; 
                    } 
                }          
    
            }

            if ( HnameSummary == "未知中文名" ){ window.close(); }
            //if ( HnameSummary == "未知中文名" ){ HnameSummary = "酒店数据未知"; }     //大阪订单

            // 显示内容的前处理     
            var HHHHname = ctripOrderHotel;         // HHHHname是酒店的简短名称，用于小窗口显示
            HHHHname = HHHHname.replace(" ","");
            HHHHname = HHHHname.replace("北海道","");
            HHHHname = HHHHname.replace("度假村","");
            HHHHname = HHHHname.replace("度假","");
            HHHHname = HHHHname.replace("大酒店","");
            HHHHname = HHHHname.replace("酒店","");
            HHHHname = HHHHname.replace("大饭店","");
            HHHHname = HHHHname.replace("饭店","");
            HHHHname = HHHHname.replace("TOMAMU","");
            HHHHname = HHHHname.replace("Tomamu","");
            HHHHname = HHHHname.replace("星野集团","");
            HHHHname = HHHHname.replace("日式旅馆","");

            ctripOrderRoomtype = ctripOrderRoomtype.replace("浴池","");
            ctripOrderRoomtype = ctripOrderRoomtype.replace("风吕","");
            ctripOrderRoomtype = ctripOrderRoomtype.replace("付","");
            
            var DATEshow = ctripOrderDate1;
            var JTBinputDate = DATEshow.replace(/-/g,"");
            var periodDays = parseInt(ctripOrderNights) + 1;

            var numEachRoom = "";
            if (ctripOrderEachRoom.match(/[单一]人/)) { numEachRoom = "1"; }
            else if (ctripOrderEachRoom.match(/[双两二]人/)) { numEachRoom = "2"; }
            else if (ctripOrderEachRoom.match(/三人/)) { numEachRoom = "3"; }
            else if (ctripOrderEachRoom.match(/四人/)) { numEachRoom = "4"; }
            else if (ctripOrderEachRoom.match(/五人/)) { numEachRoom = "5"; }
            else { numEachRoom = "？"; }

            var totalPeopleAllow;
            if ( numEachRoom == "？" ){
                totalPeopleAllow = "？";
            } else {
                totalPeopleAllow = numEachRoom * ctripOrderRooms;
            }
            
            var childA_info = "";
            if ( Hx == "塔娃" ){
                if ( ctripOrderRoomtype.match(/[四五]人/) && numEachRoom == "2" ){ 
                    childA_info = "考虑给每室加1小A"; 
                }
            }
                                
            var SPshow = ctripOrderSpecialrequest;
            SPshow = SPshow.replace("High floor preferred"," *高階層希望 ");
            SPshow = SPshow.replace("Nonsmoking preferred"," *禁煙 ");
            SPshow = SPshow.replace("Quiet room preferred","");
            SPshow = SPshow.replace("Honeymoon amenity preferred","");
            SPshow = SPshow.replace("Prefer ","*Prefer ");
            SPshow = SPshow.replace(";"," ");
            SPshow = SPshow.replace("。"," ");
            SPshow = SPshow.replace("please","");      // please
            if ( ctripOrderRooms > 2 ){ SPshow = SPshow + " *同じ階層でお願いします!"; SPshow = SPshow.replace("null",""); }
            if ( childA_info != "" ){ SPshow = SPshow + " *子供同行なし:可能"; SPshow = SPshow.replace("null",""); }
            if ( SPshow == "" ) { SPshow = " none"; }

        }

        beside_content_display_block: {                 // 根据订单类型，弹出对话框

            document.getElementById("txt_ref").innerHTML = ctripOrderRef + '　　　　　　';
            document.getElementById("txt_orderType").innerHTML = ctripOrderType;
            document.getElementById("txt_price").innerHTML = ctripOrderPrice;
            document.getElementById("txt_hotel").innerHTML = HHHHname + '　　　';
            document.getElementById("txt_meal").innerHTML = ctripOrderMeals;
            document.getElementById("txt_roomtype").innerHTML = ctripOrderRoomtype + ' ' + ctripOrderRoomtypeSub + '　';
            document.getElementById("txt_eachroom").innerHTML = "每間 " + ctripOrderEachRoom;
            document.getElementById("txt_rooms").innerHTML = ctripOrderRooms;
            document.getElementById("txt_male_female").innerHTML = totalPeopleAllow + '　' + childA_info;
            document.getElementById("txt_checkin").innerHTML = DATEshow + ' ' + Date1_dayName + ' ';
            document.getElementById("txt_days").innerHTML = periodDays;
            document.getElementById("txt_guest1").innerHTML = gName1 + ' ';
            document.getElementById("txt_request").innerHTML = SPshow;
            document.getElementById("txt_roomCodeAdvise").innerHTML = JTBRoomTypecode;      //房型推荐
            
            // label#提醒有备注').text('' + recipText)
            debug = 5;
            
            if ( ctripOrderType.match(/修改/) ){
                myWindow=window.open('', '', 'width=325, height=240, top=185, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                myWindow.document.write("<h3>　您辛苦啦！~</h3><h3>　這是一個修改单！一定要先查清楚此单之前所有的关联单号，是否在JTB上已經預訂了房间。</h3><h3>　关联单号可能不止一个！</h3>");
                myWindow.focus();
            }

            if ( ctripOrderType.match(/取消/) ){
                myWindow=window.open('', '', 'width=325, height=240, top=185, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                myWindow.document.write("<h3>　您辛苦啦！~</h3><h3>　這是一個取消单！一定要先看清楚此单的原始訂單通知时间。</h3><h3>　JTB上的取消操作要做记录！</h3><h3>　最后记得把集計表涂红。</h3>");
                myWindow.focus();
                setTimeout(function(){ window.close(); }, 700);
            }

            if ( ctripOrderType.match(/无效/) ){
                myWindow=window.open('', '', 'width=325, height=240, top=185, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                myWindow.document.write("<h3>　您辛苦啦！~</h3><h3>　這是一個无效訂單！</h3><h3>　不应该打开接单提示边栏。</h3><h3>　搜索一下关联訂單和相关邮件吧。</h3>");
                myWindow.focus();
                setTimeout(function(){ window.close(); }, 700);
            }   
      
        }

        report_summary_editing_block: {                 // 生成不带JTB信息的记录，剪贴板 和 云端

            var repo4 = 1 + d1.getMonth();
            var repo5 = d1.getDate();
            var repo6 = 1 + d2.getMonth();
            var repo7 = d2.getDate();

            var now = new Date();
            var now_month = 1 + now.getMonth();
            var now_date = now.getDate();
            if ( now_date < 10 ){ now_date = "0" + now_date; }
            var dateStamp = now_month + "-" + now_date;
            var now_hh = now.getHours();
            var now_mm = now.getMinutes();
            var timeStamp = now_mm < 10 ? (now_hh + ":0" + now_mm) : (now_hh + ":" + now_mm);

            repo4 = repo4 < 10 ? ("0" + repo4) : (repo4);
            repo5 = repo5 < 10 ? ("0" + repo5) : (repo5);
            repo6 = repo6 < 10 ? ("0" + repo6) : (repo6);
            repo7 = repo7 < 10 ? ("0" + repo7) : (repo7);

            // report_summary = ctripOrderRef +'\t'+ dateStamp +'\t'+ timeStamp +'\t'+ HnameSummary +'\t'+ gName1 +'\t'+'\t'+ ctripOrderRoomtype +'\t'+ 
            // repo4 +'\t'+ repo5 +'\t'+ repo6 +'\t'+ repo7 +'\t'+ ctripOrderNights +'\t'+ numEachRoom +'\t'+ ctripOrderRooms +'\t'+ ctripOrderPrice; 
            
            // Ver2019 核对表中 订单记录的首行的 Ctrip部分
            // 如果不用JTB接单，report_summary编辑到这里就足够了
            report_summary = now_date +'\t'+ "札幌" +'\t'+ "呉旭輝" +'\t'+ "CTRIP" +'\t'+ ctripOrderRef +'\t'+ "ホテル" +'\t'+ HnameTable[Hx][2] 
            +'\t\t'+ repo4+"月" +'\t'+ repo5 +'\t'+ repo6+"月" +'\t'+ repo7 +'\t'+ ctripOrderNights +'\t'+ totalPeopleAllow*ctripOrderNights +'\t'+ ctripOrderRooms*ctripOrderNights 
            +'\t'+ ctripOrderPrice +'\t'+ '\t'+ '\t'+ '\t'+ gName1 +'\t\t\t\t\t\t\t'


            // 编辑 google sheet 云端记录（不带JTB信息）
            running_water_record[0][0] = report_summary;
            running_water_record[0][1] = ctripOrderRef;
            running_water_record[0][2] = dateStamp;
            running_water_record[0][3] = timeStamp;
            running_water_record[0][4] = HnameSummary;
            running_water_record[0][5] = gName1;
            running_water_record[0][6] = ctripOrderPrice;

        }    

        modal_content_display_block: { 

            var MS_report = "";
            var ctripOrderNames = GuestnameList.length;     // 姓名个数 ≤ 订单通知人数 ≤ 实际入住人数 ≤ 预订可住人数
            ctripOrderNames = ctripOrderNames.toString();
            var ctripOrder_1Ref = ctripOrderRef.slice(1);
            // 编辑MS报告

            // 依次判断： 预订间数，每间入住人数，实际报告的姓名个数    debug ctrip order: 7557303377 7725211919
            switch( ctripOrderRooms ){
            case "1":
                    switch( numEachRoom ){
                    case "1":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　"; break;
                            } break;
                    case "2":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　同行者：" + gName[2]; break;
                            } break;
                    case "3":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1] + "　" + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　同行者：" + gName[2] + "　" + gName[3]; break;
                            } break;                
                    case "4":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1] + "　" + gName[2]; break;
                            case "3": MS_report = "番" + ctripOrder_1Ref + "　代表者：" + gName[1] + "　" + gName[2] + "　" + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　同行者：" + gName[2] + "　" + gName[3] + "　" + gName[4]; break;
                            } break;
                    } break;

            case "2":
                    switch( numEachRoom ){                  //　*1 AA/AA　BB/BB　*2 CC/CC　DD/DD  
                    case "1":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　*2 " + gName[2]; break;
                            } break;
                    case "2":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4]; break;
                            } break;
                    case "3":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6]; break;
                            } break;                
                    case "4":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6]; break;
                            case "7": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6] + "　" + gName[7]; break;
                            case "8": MS_report = "番" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　" + gName[4] + "　*2 " + gName[5] + "　" + gName[6]+ "　" + gName[7] + "　" + gName[8]; break;
                            } break;                
                    } break;

            case "3":
                    switch( numEachRoom ){                  //　*1 AA/AA　BB/BB　*2 CC/CC　DD/DD　*3 EE/EE　FF/FF  
                    case "1":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1] + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3]; break;
                            } break;
                    case "2":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　" + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3] + "　*3 " + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6]; break;
                            } break;
                    case "3":
                            switch( ctripOrderNames ){
                            case "1": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者：" + gName[1]; break;
                            case "2": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2]; break;
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　" + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3] + "　*3 " + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6]; break;
                            case "7": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　" + gName[7]; break;
                            case "8": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　" + gName[5] + "　*3 " + gName[6] + "　" + gName[7] + "　" + gName[8]; break;
                            case "9": MS_report = "番" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6] + "　*3 " + gName[7] + "　" + gName[8] + "　" + gName[9]; break;
                            } break;                
                    case "4":
                            switch( ctripOrderNames ){
                            case "3": MS_report = "客番号：" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3]; break;
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　" + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3] + "　*3 " + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6]; break;
                            case "7": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　" + gName[7]; break;
                            case "8": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　" + gName[5] + "　*3 " + gName[6] + "　" + gName[7] + "　" + gName[8]; break;
                            case "9": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6] + "　*3 " + gName[7] + "　" + gName[8] + "　" + gName[9]; break;
                            case "10": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6] + "　*3 " + gName[7] + "　" + gName[8] + "　" + gName[9] + "　" + gName[10]; break;
                            case "11": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6] + "　" + gName[7] + "　*3 " + gName[8] + "　" + gName[9] + "　" + gName[10] + "　" + gName[11]; break;
                            case "12": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　" + gName[4] + "　*2 " + gName[5] + "　" + gName[6] + "　" + gName[7] + "　" + gName[8] + "　*3 " + gName[9] + "　" + gName[10] + "　" + gName[11] + "　" + gName[12]; break;
                            } break;                
                    } break;

            case "4":
                    switch( numEachRoom ){                  //　*1 AA/AA　BB/BB　*2 CC/CC　DD/DD　*3 EE/EE　FF/FF　*4 GG/GG　HH/HH  
                    case "2":
                            switch( ctripOrderNames ){
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　" + gName[4] + "　*4 " + gName[5] + "　" + gName[6]; break;
                            case "7": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3] + "　*3 " + gName[4] + "　" + gName[5] + "　*4 " + gName[6] + "　" + gName[7]; break;
                            case "8": MS_report = "番" + ctripOrder_1Ref + "　名簿 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　*4 " + gName[7] + "　" + gName[8]; break;
                            } break;
                    case "3":
                            switch( ctripOrderNames ){
                            case "4": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4]; break;
                            case "5": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　" + gName[5]; break;
                            case "6": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　" + gName[4] + "　*4 " + gName[5] + "　" + gName[6]; break;
                            case "7": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3] + "　*3 " + gName[4] + "　" + gName[5] + "　*4 " + gName[6] + "　" + gName[7]; break;
                            case "8": MS_report = "番" + ctripOrder_1Ref + "　代表者 *1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　*4 " + gName[7] + "　" + gName[8]; break;
                            case "9": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　*4 " + gName[7] + "　" + gName[8] + "　" + gName[9]; break;
                            case "10": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　" + gName[7] + "　*4 " + gName[8] + "　" + gName[9] + "　" + gName[10]; break;
                            case "11": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　" + gName[5] + "　*3 " + gName[6] + "　" + gName[7] + "　" + gName[8] + "　*4 " + gName[9] + "　" + gName[10] + "　" + gName[11]; break;
                            case "12": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　" + gName[3] + "　*2 " + gName[4] + "　" + gName[5] + "　" + gName[6] + "　*3 " + gName[7] + "　" + gName[8] + "　" + gName[9] + "　*4 " + gName[10] + "　" + gName[11] + "　" + gName[12]; break;
                            } break;                
                    case "4":
                            switch( ctripOrderNames ){
                            case "4": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4]; break;
                            case "16": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[5] + "　*3 " + gName[9] + "　*4 " + gName[13] + "　*後日FAXで名簿を送ります."; break;
                            } break;  
                    } break;
                    
            case "5":
                    switch( numEachRoom ){                  //　*1 AA/AA　BB/BB　*2 CC/CC　DD/DD　*3 EE/EE　FF/FF　*4 GG/GG　HH/HH　*5 JJ/JJ　KK/KK  
                    case "2":
                            switch( ctripOrderNames ){
                            case "5": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　*5 " + gName[5]; break;
                            case "6": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　*5 " + gName[5] + "　" + gName[6]; break;
                            case "7": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　" + gName[5] + "　*5 " + gName[6] + "　" + gName[7]; break;
                            case "8": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　" + gName[4] + "　*4 " + gName[5] + "　" + gName[6] + "　*5 " + gName[7] + "　" + gName[8]; break;
                            case "9": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　" + gName[3] + "　*3 " + gName[4] + "　" + gName[5] + "　*4 " + gName[6] + "　" + gName[7] + "　*5 " + gName[8] + "　" + gName[9]; break;
                            case "10": MS_report = "*1 " + gName[1] + "　" + gName[2] + "　*2 " + gName[3] + "　" + gName[4] + "　*3 " + gName[5] + "　" + gName[6] + "　*4 " + gName[7] + "　" + gName[8] + "　*5 " + gName[9] + "　" + gName[10]; break;
                            } break;
                    case "3":
                            switch( ctripOrderNames ){
                            case "5": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　*5 " + gName[5]; break;
                            case "15": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[4] + "　*3 " + gName[7] + "　*4 " + gName[10] + "　*5 " + gName[13] + "　*後日FAXで名簿を送ります."; break;
                            } break; 
                    case "4":
                            switch( ctripOrderNames ){
                            case "5": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[2] + "　*3 " + gName[3] + "　*4 " + gName[4] + "　*5 " + gName[5]; break;
                            case "20": MS_report = "代表者 *1 " + gName[1] + "　*2 " + gName[5] + "　*3 " + gName[9] + "　*4 " + gName[13] + "　*5 " + gName[17] + "　*後日FAXで名簿を送ります."; break;
                            } break;                                     
                    } break;

            default: {
                MS_report = '番' + ctripOrder_1Ref + '　' + gNameShow; 
                MS_report_finish = 0;
                } break;      
            }
            
            // case 嵌套，用default会变很奇怪的效果。。结果证明只是内层的break漏掉了而已。
                                
            if ( SPshow != " none" ){ MS_report = MS_report + '　' + SPshow; }
            MS_report = MS_report.replace("undefined","あります。");
            MS_report = MS_report.replace("子供同行なし:可能","子供同行しないかも,料金はそのままでOKです.");

            $('#btn_All_of_Names').on('click', function () {

                var modal = $('.my-modal')

                modal.find('.modal-body label#txt_modal_1').text(ctripOrderRooms)    
                modal.find('.modal-body label#txt_modal_2').text(ctripOrderEachRoom)    
                modal.find('.modal-body label#txt_modal_3').text(totalPeopleAllow)    
                modal.find('.modal-body label#txt_modal_4').text(ctripOrderPeoples)
                modal.find('.modal-body label#txt_modal_content').text('　' + MS_report)

                //modal.find('.modal-body label#提醒有备注').text('' + recipText)

                $('.my-modal').fadeIn();
                $body.addClass('no-scroll');

                setTimeout(function(){

                    // 按下所有人按钮，向 clipboard 写入 MS报告
                    navigator.clipboard.writeText( MS_report )    
                    .then(() => {
                        //log('Text copied.');
                        if ( MS_report_finish == 0 ){
                            myWindow=window.open('', '', 'width=325, height=240, top=185, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                            myWindow.document.write("<h3>　您辛苦啦！~</h3><h3>　这个订单预订房间数太多了！也有可能是通知的姓名不规范，无法自动处理。</h3><h3>　請您自己手动编辑MS报告！</h3>");
                            myWindow.focus();
                        }
                    })
                    .catch(() => {
                        //log('Failed to write clipboard');
                    });

                }, 150);
                
            }); 
            debug = 7;
        }

        // "JTB确认号提取"按钮
        $('#btn_make_bookingID').on('click', function () {
            debug = 7.1;
            var RoomConfirm = new Array();    // 用于存放所有房间确认号，从第一晚开始
            RoomConfirm[0] = "";
            var RoomConfirmShow = "";         // 把所有房间确认号显示成一行
            var NitteConfirmLog = new Array(); 
            NitteConfirmLog[0] = "";
            var NitteConfirmReport = "";

            navigator.clipboard.readText()
            .then(text => {

                debug = 7.2;
                pasteStrJTB = text;        // 此处开始引入 JTB Booked 済画面的处理
                //log('Text pasted.');

                // 对JTB画面的正则提取部分
                JTBbookedInfo_extracting_block: {

                    var JTBbookedThing = new Array();

                    // var regExp_JTBKannriRef = /\(管理\)NO\s+(\w+)/;
                    // JTBbookedThing[0] = pasteStrJTB.match(regExp_JTBKannriRef);
                    // var JTBKannriRef = RegExp.$1;

                    // var regExp_JTBKanaName = /\(カナ\)\s+(\w[ \w]+\w)/;
                    // JTBbookedThing[1] = pasteStrJTB.match(regExp_JTBKanaName);
                    // var JTBKanaName = RegExp.$1;

                    // var regExp_JTBSougaku = /概算総額\s+￥([,\d]+)/;
                    // JTBbookedThing[2] = pasteStrJTB.match(regExp_JTBSougaku);
                    // var JTBSougaku = RegExp.$1;
                    // JTBSougaku = JTBSougaku.replace(",","");

                    var regExp_JTB_Info1 = /端末ID.*(0P128\d{3})[\s\S]*\(管理\)NO\s+(\w+)[\s\S]*\(カナ\)\s+(\w[ \w]+\w)[\s\S]*概算総額\s+[\\￥]([,\d\*]+)\s/;
                    JTBbookedThing[0] = pasteStrJTB.match(regExp_JTB_Info1);    //[\s\S]* 可以匹配任意字符，包括换行符
                    var JTBTerminalID = RegExp.$1;
                    var JTBKannriRef = RegExp.$2;
                    var JTBKanaName = RegExp.$3;
                    var JTBSougaku = RegExp.$4;

                    var regExp_JTB_Info2 = /(20\d\d\/\d\d\/\d\d.+約済.+H-01)/g;
                    JTBbookedThing[3] = pasteStrJTB.match(regExp_JTB_Info2);      
                    var JTBNitteiInfo = JTBbookedThing[3];      // 日程数组，每个元素是一行日程

                    if ( JTBNitteiInfo != null ){
                        var regExp_RoomConfirm = /(\w{5}H-01)/;     // 不用正则也行
                        for ( var j = 0 ; j < JTBNitteiInfo.length ; j++ ){
                            RoomConfirm[1+j] = JTBNitteiInfo[j].slice(-9);
                            RoomConfirmShow = RoomConfirmShow + "，" + RoomConfirm[1+j];                
                        }                        
                        RoomConfirmShow = RoomConfirmShow.slice(1); 
                    }

                    JTBTotalPrice = JTBSougaku.replace(/,/g,"");
                    
                    priceProfit = parseFloat(ctripOrderPrice) - parseFloat(JTBTotalPrice) * 0.9; 
                    orderProfit = 1 - ( parseFloat(JTBTotalPrice) * 0.9 / parseFloat(ctripOrderPrice) );
                    var orderProfitShow = orderProfit.toFixed(3) * 100;
                    orderProfitShow = orderProfitShow.toFixed(1);

                    //report_summary = report_summary +'\t'+ RoomConfirmShow +'\t'+ JTBTotalPrice;    // 不可以这样写！考虑到用户可能多次点击提取按钮！
                    /* 2018旧版格式:
                    report_summary = ctripOrderRef +'\t'+ HnameSummary +'\t'+ gName1 +'\t'+ repo4 +'\t'+ repo5 +'\t'+ repo6 +'\t'+ repo7 
                    +'\t'+ ctripOrderNights +'\t'+ numEachRoom +'\t'+ ctripOrderRooms +'\t'+ ctripOrderPrice +'\t'+ dateStamp +'\t'+ timeStamp
                    +'\t'+ RoomConfirmShow +'\t'+ JTBTotalPrice;  */
                    /* 2018新版格式:
                    report_summary = ctripOrderRef +'\t'+ dateStamp +'\t'+ timeStamp +'\t'+ HnameSummary +'\t'+ gName1 +'\t'+ JTBTotalPrice +'\t'+ ctripOrderRoomtype +'\t'+ 
                    repo4 +'\t'+ repo5 +'\t'+ repo6 +'\t'+ repo7 +'\t'+ ctripOrderNights +'\t'+ numEachRoom +'\t'+ ctripOrderRooms +'\t'+ ctripOrderPrice
                    +'\t'+ JTBKannriRef +'\t'+ RoomConfirmShow +'\t'+ JTBTotalPrice;  */

                    // Ver2019 核对表中 订单记录的首行的 Ctrip部分 + JTB部分
                    report_summary = now_date +'\t'+ "札幌" +'\t'+ "呉旭輝" +'\t'+ "CTRIP" +'\t'+ ctripOrderRef +'\t'+ "ホテル" +'\t'+ HnameTable[Hx][2] 
                    +'\t\t'+ repo4+"月" +'\t'+ repo5 +'\t'+ repo6+"月" +'\t'+ repo7 +'\t'+ ctripOrderNights +'\t'+ totalPeopleAllow*ctripOrderNights +'\t'+ ctripOrderRooms*ctripOrderNights 
                    +'\t'+ ctripOrderPrice +'\t'+ parseFloat(JTBTotalPrice)*0.9 +'\t'+ priceProfit +'\t'+ orderProfitShow+"%" +'\t'+ gName1 +'\t\t\t\t\t\t\t'
                    + Hx +'\t'+ ctripOrderRoomtype +'\t'+ ctripOrderSaleTypeID +'\t'+ ctripOrderEachRoom +'\t'+ numEachRoom +'\t'+ ctripOrderRooms +'\t'+ (indexD) +'\t'+ "-- " +'\t'+ "-- "
                    +'\t\t'+ JTBKannriRef +'\t'+ JTBKanaName +'\t'+ (j) +'\t'+ "-- " +'\t'+ JTBTotalPrice +'\t'+ "-- " +'\t'+ "-- " +'\t'+ "-- " +'\t'+ "-- "
                    +'\t'+ dateStamp +'\t'+ timeStamp +'\n';
                    // (1+indexD) 是携程详情页面中"每日房价"标签的个数，(1+j) 是JTB済画面中房间确认号的个数, ++之后不需要+1

                    // 编辑 google sheet 云端记录（加JTB信息）
                    running_water_record[0][0] = report_summary;
                    running_water_record[0][7] = JTBKannriRef;
                    running_water_record[0][8] = JTBTotalPrice;

                }
                
                JTBbookedInfo_extracting_block_2: {

                    // Ver2019 抽取核对表中 核対项所需的信息
                    // regexr.com/ List验证：$1 ■ $2 ■ $3 ■ $4 ■ $5 ■ $6 ■ $7 ■ $8 ■ $9 \n
                    // 两种情况： ■取消料は予約情報詳細にて確認してください    ■取消料収受....
                    var regExp_JTB_Info3 = 
/  ([^w]{1,5})\s+\w{6}-01\s+.+\s+■.+■(男性\w+名).+料金\s[￥\\]([\d,*]+)\s.*■取消料.+[2|に][0|て][\d|確][\d|認][\/|し][\d|て][\d|く][\/|だ][\d|さ][\d|い]\s+＜日程情報.+\s+(20\d\d\/\d\d\/\d\d)\s\sA\)([^ ]+)\s\s([^ ]+.*)\s\s([\w]{3})\s\s([^ ]+\s+[^ ]+).+..[待済]\s{2,3}(\w{5}H)-01/g;
                    var HakouZumi_list = new Array();         //発行済  
                    var MenNumbers_list = new Array();        //男性X名   
                    var roomFee_list = new Array();           // ■合計料金、日程料金
                    var cancelFrom_list = new Array();        //取消料収受開始日
                    var CXLbackDate = new Array();            //计算出安全返还房间的截止日期  
                    var CXLrepo = new Array();
                    var date_list = new Array();              //宿泊日
                    var checkInDate = new Array();
                    var hotelName_list = new Array();
                    var roomType_list = new Array();
                    var planCode_list = new Array();          //3位数字或字母  
                    var peopleInfo_list = new Array();
                    var status_list = new Array();            //..[待済]
                    var RevNum_list = new Array();            //房间确认号

                    var indexT = 0;
                    pasteStrJTB.replace(regExp_JTB_Info3,function($0,$1){
                        HakouZumi_list[1+indexT] = arguments[1];
                        MenNumbers_list[1+indexT] = arguments[2];
                        roomFee_list[1+indexT] = arguments[3];
                        date_list[1+indexT] = arguments[4];           
                        hotelName_list[1+indexT] = arguments[5];
                        roomType_list[1+indexT] = arguments[6];
                        planCode_list[1+indexT] = arguments[7];
                        peopleInfo_list[1+indexT] = arguments[8];
                        RevNum_list[1+indexT] = arguments[9];
                        indexT++;
                    });

                    for ( var j = 1 ; j < indexT+1 ; j++ ){

                        /*
                        var cx_d1 = new Date(cancelFrom_list[j]);
                        var cx_d2 = new Date(date_list[j]);

                        if ( cx_d1.toString() !== "Invalid Date" ){
                            var needFix = 0;
                            if ( cx_d1.getMonth() !== cx_d2.getMonth() ){
                                var needFix = 1;
                            }
                            var diff = Math.ceil((cx_d2 - cx_d1) / (1000 * 3600 * 24));      //済画面上取消料収受開始日对入住日的提前天数
                            if ( diff > 9 ){
                                cx_d1.setDate( cx_d1.getDate() - 3 );
                            } else {
                                cx_d1.setDate( cx_d2.getDate() - 12 );
                                if ( needFix ){                         //这里可能是有问题的！理由没有完全搞清..
                                    cx_d1.setDate( cx_d1.getDate() + 31 );
                                }
                            }
                            var yyyy = cx_d1.getFullYear();
                            var mm = cx_d1.getMonth() + 1;     if ( mm < 10 ){ mm = "0" + mm; } 
                            var dd = cx_d1.getDate();          if ( dd < 10 ){ dd = "0" + dd; }      
                            CXLrepo[j] = yyyy + "-" + mm + "-" + dd; 
                        } else {
                            CXLrepo[j] = "要収受..";
                        }

                        mm = cx_d2.getMonth() + 1; dd = cx_d2.getDate();      //宿泊月,宿泊日
                        var sTag = "";
                        if ( status_list[j].match("取消待") ){ sTag = "待"; }
                        else if ( status_list[j].match("予約済") ){  sTag = "1"; }
                        else { sTag = "⛔"; }  */

                        if ( roomFee_list[j] == "***" ){ roomFee_list[j] = "未表示"; }

                        // KarioConfirmLog[j] = hotelName_list[j] +'\t'+ roomType_list[j] +'\t'+ mm+"月" +'\t'+ dd +'\t'+ RevNum_list[j] +'\t'+ sTag +'\t'+ roomFee_list[j] +'\t'+ JTBKanaName +'\t'+ dateStamp +'\t'+ JTBKannriRef +'\t'+ CXLrepo[j] ; //+'\t'+ "1" +'\t'+ "1-1";
                        
                        NitteConfirmLog[j] = now_date +'\t'+ "札幌" +'\t'+ "--" +'\t'+ "第 "+j+" 项" +'\t'+ "尾号："+ctripOrderRef.slice(-4) +'\t'+ "核対项" +'\t'+ HnameTable[Hx][0] 
                        +'\t\t'+ DailyDate_list[j] +'\t\t'+ ctripOrderRoomtype +'\t\t'+ ctripOrderEachRoom +'\t\t'+ ctripOrderRooms+" 间" +'\t'+ "每间 "+DailyPrice_list[j] +'\t'+ "原价 "+roomFee_list[j]
                        +'\t'+ "-- " +'\t'+ "第 "+j+" 晚" +'\t'+ RevNum_list[j] +'\t\t\t\t\t\t'+ ctripOrderType 
                        +'\t'+ Hx +'\t'+ TYPEx +'\t'+ ctripOrderSaleTypeID +'\t'+ ctripOrderEachRoom +'\t'+ numEachRoom +'\t'+ ctripOrderRooms +'\t'+ j+" ("+ctripOrderNights+")" +'\t'+ DailyDate_list[j] +'\t'+ DailyPrice_list[j] 
                        +'\t\t'+ RevNum_list[j] +'\t'+ HakouZumi_list[j] +'\t'+ date_list[j] +'\t'+ MenNumbers_list[j] +'\t'+ roomFee_list[j] +'\t'+ hotelName_list[j] +'\t'+ roomType_list[j] +'\t'+ planCode_list[j] +'\t'+ peopleInfo_list[j] 
                        +'\t'+ "-- " +'\t'+ JTBTerminalID;
                        NitteConfirmReport = NitteConfirmReport + NitteConfirmLog[j] +'\n';     

                    }

                }

                report_summary = report_summary + NitteConfirmReport;
                debug = 7.4;
                setTimeout(function(){

                    navigator.clipboard.writeText(RoomConfirmShow)    // JTBKannriRef
                    .then(() => {
                        //log('Text copied.');
                    })
                    .catch(() => {
                        //log('Failed to write clipboard');
                    });

                    // 以下这些 if语句 如果不放在writeText的setTimeout内部并且写在writeText的后面，会造成writeText写入失败..
                    if ( indexD !== indexT ){       //indexD !== indexT
                        myWindow=window.open('', '警報', 'width=325, height=240, top=185, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                        myWindow.document.write("<h3>　您辛苦啦！~</h3><h3>　发现问题： <span style=\"background-color:#ff8826;\"><font color=\"#ffffff\">&#8201天数不相等&#8201</font></span> ！！</h3><h3>　請检查携程訂單中要求的天数，</h3><h3>　是否和JTB预约頁面中实际处理的天数一致? </h3>");
                        myWindow.focus();    
                        myWindow.onclick = function(){
                            myWindow.close();
                        }                    
                    }
                    
                    if ( JTBNitteiInfo != null ){
                        document.getElementById("txt_show_OK").innerHTML = "　　　　OK!";
                    }
                    else {
                        document.getElementById("txt_show_OK").innerHTML = "　　 未手配 ?";
                    }
                    
                    if ( orderProfitShow == "NaN" ) { orderProfitShow = "⛔"; }
                    document.getElementById("txt_show_profit").innerHTML = "　利益率 " + orderProfitShow + " %";
                    setTimeout(function(){
                        document.getElementById("txt_show_OK").innerHTML = "";
                        document.getElementById("txt_show_profit").innerHTML = "";
                    }, 8500);

                }, 200);

            })
            .catch(() => {
                log(' JTB_Info Failed ! debug = ' + debug);
            });

        }); 

        // "JTB完成去填集計"按钮
        var reserv_Order_Tips = ( reserv_Order == true )? 1 : 0;
        $('#btn_JTB_confirmed').on('click', function () {

            $('#btn_JTB_confirmed').delay(240).queue(function(){        //原因不明：
                if ( reserv_Order_Tips == 0 ){                          //似乎是在 queue(function(){ 里面放了 if 之后，window.close()就失效了
                    window.close();
                }
            });

            
            navigator.clipboard.writeText(report_summary)   // debug: report_summary
            .then(() => {
                //log('Text copied.');

                if ( reserv_Order_Tips == 1 ){        // EBK后台操作提示
                    

                    myWindow=window.open('', '提示', 'width=500, height=320, top=280, left=600, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                    myWindow.document.write("<h3>　這是一個 <span style=\"background-color:#32cd32;\"><font color=\"#fffff0\">&#8201保留房&#8201</font></span> 訂單！</h3><h3>　請依據剛才記錄的JTB房型的<font color=\"#CC0033\">残室</font>数字，先回到携程訂單的房型頁面，完成設定：</h3><h3>　<font color=\"#CC0033\">現在残室 >= ３</font></br>　　　點選日期、立即确认房量、余量等于１、保存</h3><h3>　<font color=\"#CC0033\">現在残室 = ０</font></br>　　　點選日期、关房、保存</h3>");
                    myWindow.focus();    
                    myWindow.onclick = function(){
                        reserv_Order_Tips = 0;

                        // 在Chrome中，如果window.open()函数不是被鼠标键盘事件调用的，而是页面直接调用或通过定时器等调用的，则打开新窗口而非标签
                        // 除了IE之外,浏览器不支持使用JS全屏.这是故意的：to avoid disorienting users.                        
                        ctripWindow = window.open("http://www.vipdlt.com/MIP/RoomManagement/MIP/RoomManage.aspx?room="+ctripOrderSaleTypeID, '', 'fullscreen=1, top=0, left=0, toolbar=no, menubar=no, location=no, status=no','height='+screen.height+', width='+screen.width);
                        ctripWindow.alert("\n　Tip:  \n\n　　　從　"+DATEshow+"　開始，　宿泊　"+ctripOrderNights+"　天\n"); 

                        myWindow.close();
                        
                    }    
                }

            })
            .catch(() => {
                //log('Failed to write clipboard');
            });

            //在此加入向云端sheet存数据的处理：JTB running water records
            // makeApiCall();


        });

        // 订单信息标签的点击响应
        $('#txt_checkin').on('click', function () {
            
            debug = 8.01
            navigator.clipboard.writeText(JTBinputDate)    
            .then(() => {
                //log('Text copied.');

            })
            .catch(() => {
                alert("debug = " + debug);
            });

        });

        $('#txt_hotel').on('click', function () {
            
            debug = 8.02
            navigator.clipboard.writeText(HnameJTBcode)    
            .then(() => {
                //log('Text copied.');
                if ( reserv_Order == true ){
                    myWindow=window.open('', '', 'width=325, height=240, top=185, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                    myWindow.document.write("<h3>　您辛苦啦！~</h3><h3>　這是一個 <span style=\"background-color:#32cd32;\"><font color=\"#fffff0\">&#8201保留房&#8201</font></span> 訂單！</h3><h3>　請在検索結果中記錄JTB房型的<font color=\"#CC0033\">残室</font>数字</h3><h3>( 若真的使用押房接单，需要先清查一下相关日期保留房的间数 )</h3>");
                    myWindow.focus();    
                    myWindow.onclick = function(){
                        myWindow.close();
                    }                    
                }   

            })
            .catch(() => {
                alert("debug = " + debug);
            });

        });

        $('#txt_guest1').on('click', function () {
            
            debug = 8.03
            navigator.clipboard.writeText(gName1)    
            .then(() => {
                //log('Text copied.');
            })
            .catch(() => {
                alert("debug = " + debug);
            });

        });

        $('#txt_ref').on('click', function () {
            
            var ref_report = ctripOrderRef +'\t'+ dateStamp +'\t'+ gName1;
            
            navigator.clipboard.writeText(ref_report)    
            .then(() => {
                //log('Text copied.');
            })
            .catch(() => {
                alert("debug = " + debug);
            });

        });

        // modal 的 Close 按钮            
        $('#btn_modal_confirmed').on('click', function () {
            $('.my-modal').fadeOut();
            $body.removeClass('no-scroll');
        });

        /* 首发内容写入。此处设置若干延迟，防止readText和writeText同时相应造成异常 */
        setTimeout(function(){

            debug = 8.2;
            //alert(" setTimeout HERE! " + gName1 );    // 此处如果让alert有效，writeText就不起作用了!
            //log('PPPPPPpied.');
            navigator.clipboard.writeText(JTBinputDate)    
            .then(() => {
                //log('Text copied.');
            })
            .catch(() => {
                //log('Failed to write clipboard');
            });

        }, 600);

    })
    .catch(() => {
        log(' MAIN Failed ! v1117 debug = ' + debug);
    });

}, 50);
});

$('#faceImg').on('click', function () {

    navigator.clipboard.writeText(" 天堂有路你不走，学海无涯苦作舟！ ")    
    .then(() => {

        if ( gName1 == "" ){
            myWindow=window.open('', '', 'width=365, height=635, top=15, left=700, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
            myWindow.document.write("<br/><h2>　小伙伴们辛苦啦！~</h2><h2>　　<span style=\"background-color:#31cccc;\"><font color=\"#cc317e\">&#8201去欧罗巴！靠我们自己&#8201</font></span> </h2><br/><h3>　<font color=\"#0c0c33\">本视窗特别鸣谢：</font></h3><br/><h3>　&#9825 原案策划 &#9825　北海道・旭</h3><h3>　&#9825 界面设计 &#9825　NTD-coding猿</h3><h3>　&#9825 开发管理 &#9825　爱大蒜SAMA</h3><h3>　&#9825 １期主试 &#9825　有澤さん</h3><h3>　&#9825 ２期主试 &#9825　Tsai.Chieh</h3><h3>　&#9825 黏合创艺 &#9825　愛因斯坦</h3><br/><a style=\"font-size:12px;font-family:Meiryo;font-style:oblique;color:rgb(100, 100, 248)\">　　　　　　　　　　　　　　　　　　　　　♪ 未完待续 ♫</a>");
            myWindow.focus();    
            myWindow.onclick = function(){
                myWindow.close();
            }                    
        }                           

    })
    .catch(() => {
        alert("debug = " + debug);
    });

});

/* 防止小窗口读不到clipboard 
setTimeout(function(){
}, 350);*/

googleSheetAPI: {

    function makeApiCall() {
        var params = {
            spreadsheetId: '1oMxmdfvyTdLbt6qE4A6oefZbTkfsgwQmK-noAHtsqUw',  
            range: 'A1',  //莫非这里？
            //valueRenderOption: 'FORMATTED_VALUE',  
            //dateTimeRenderOption: 'FORMATTED_STRING',  
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
        };
        var valueRangeBody = {
            "range": "A1",
            "majorDimension": "ROWS",
            "values": running_water_record
        };
        //var request = gapi.client.sheets.spreadsheets.values.get(params);
        //var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
        var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        request.then(function(response) {
            //console.log(response.result);
            //showme(response.result);
        }, function(reason) {
            console.error('error: ' + reason.result.error.message);
        });
    }

    function initClient() {
        var API_KEY = 'AIzaSyARYxwdJGZifzTMzVbugm2y3e_usJyeSI0';  
        var CLIENT_ID = '245476283463-52jkpneqbe8dkd9dk3p4juptd8c3s1ph.apps.googleusercontent.com'; 
        var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';   //.readonly

        gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(function() {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    /*function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        makeApiCall();
    }
    }*/
    
    function handleSignInClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }
    
    function showme(result){
        //document.getElementById("lbl_1").innerHTML = result.values[0][0];
    }

    setTimeout(function(){
        //window.close();
    }, 1600);

}

//$('#btn_some_process').on('click', function () { }); 
//$('#btn_some_process').delay(100).queue(function(){ });

/* Watch for pastes *
navigator.clipboard.addEventListener('clipboardchange', e => {
    navigator.clipboard.getText().then( text => {
    log('Updated clipboard contents: '+text)
    })
}); */

/* Since Chrome only allows clipboard access when a tab is the current active, here's a trick: *
function log(value) {
    clearTimeout(log.timer);
    if (toast.hidden) toast.textContent = value;
    else toast.textContent += '\n' + value;
    toast.className = String(value).match(/error/i) ? 'error' : '';
    toast.hidden = false;
    log.timer = setTimeout( () => { toast.hidden = true; }, 3000);
} */
