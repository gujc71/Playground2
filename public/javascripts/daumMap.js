function getMarker(place) {
    var str= '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + place.PGNAME +'</div>' + 
            '        <div class="body">' + 
//            '            <div class="img"><img src="/images/noimage.png" width="73" height="70"></div>' + 
            '            <div class="img"><div class="placeAvarta" style="margin-top:15px !important"><i class="material-icons mdl-list__item-avatar noRound">' + place.PLACEICON + '</i></div></div>' +
            '            <div class="desc">' + 
            '                <div class="ellipsis">' + place.PGADDR + '</div>'+
            '                <div>';
            if (place.PGTYPE2NM) str += place.PGTYPE2NM;
            if (place.PGURL) str += ' <a href="' + place.PGURL + '" target="_blank" class="link">홈페이지</a>';
            str += '               <a href="http://map.daum.net/link/to/' + place.PGNAME + ',' + place.PGLAT + ',' + place.PGLON + '" target="_blank" class="link">길찾기</a>' + 
            '                </div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';    
    return str;
};

function getMarker4Event(place) {
    var list = place.PLAY.split(",");
    var str= '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + place.SEPLACE +'</div>' + 
            '        <div class="body">' + 
            '            <div class="desc4event">' + 
            '                <div><div class="eventMarkerAddr">' + place.SEADDR + '</div> <a href="http://map.daum.net/link/to/' + place.SEPLACE + ',' + place.SELAT + ',' + place.SELON + '" target="_blank" class="eventlink">길찾기</a>'+
            '                  <a href="myTownMap?lat=' + place.SELAT + '&lng=' + place.SELON + '" target="_blank" class="eventlink">주변검색</a> '+
            '                </div>' +
            '                <div>';
    list.forEach(function(element) {
        var items = element.split("|");
        str += '연주자: <a href="https://seoulbusking.com:49357/bbs/board.php?bo_table=artist_03_2019&sca=&sop=and&sfl=wr_subject&stx=' + items[0] + '" target="_blank" class="link">' + items[0] + '</a>(' + items[2] + ')' + 
               ' 시간: ' + items[1] + '<br/>';
    });
             
    str +=  '                </div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';    
    return str;
};

var activeWindow = null

function showMap(mapContainer, center, positions, level) {
    var mapOption = { 
        center: center? center: positions[0].latlng, // 지도의 중심좌표
        //level: positions.length>1 ? 5 : 3 // 지도의 확대 레벨
        level: level ? level : 5 // 지도의 확대 레벨
    };

    var markerList = [];// add by gu
    var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    addMarker(map, positions, markerList);


    /*/ 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
    function makeOverListener(map, marker, infowindow) {
        return function() {
            infoopen(map, marker);
        };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
    function makeOutListener(infowindow) {
        return function() {
            infoclose();
        };
    }*/
    return {map:map, markerList:markerList};
}


function addMarker(map, positions, markerList) {
    var showSmall = positions.length > 30;
    if (showSmall) {
        var iconSize = 8;
        if (window.innerWidth< 500) iconSize = 10;
    
        var markerImage ={
            A: new daum.maps.MarkerImage( "/images/markerA.png", new daum.maps.Size(iconSize, iconSize)), 
            B: new daum.maps.MarkerImage( "/images/markerB.png", new daum.maps.Size(iconSize, iconSize)), 
            C: new daum.maps.MarkerImage( "/images/markerC.png", new daum.maps.Size(iconSize, iconSize)), 
            D: new daum.maps.MarkerImage( "/images/markerD.png", new daum.maps.Size(iconSize, iconSize)), 
            E: new daum.maps.MarkerImage( "/images/markerE.png", new daum.maps.Size(iconSize, iconSize)), 
            F: new daum.maps.MarkerImage( "/images/markerF.png", new daum.maps.Size(iconSize, iconSize)), 
            Z: new daum.maps.MarkerImage( "/images/markerZ.png", new daum.maps.Size(iconSize, iconSize)), 
        }
    }

    for (var i = 0; i < positions.length; i ++) {
        // 마커를 생성합니다
        var markerOpt = {
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커의 위치
            clickable: true
        };
        if (showSmall) {
            markerOpt.image = markerImage[positions[i].place.PGTYPE1];
        }
        var marker = new daum.maps.Marker(markerOpt);
        marker.place = positions[i].place;
        markerList.push(marker);

        var infowindow = new daum.maps.InfoWindow({
            content: positions[i].content, // 인포윈도우에 표시할 내용
            removable : true,
            position: marker.getPosition()       
        });
        marker.infowindow = infowindow;
        
        /*if (positions.length===1) {

            infoopen(map, marker);
        }*/

        daum.maps.event.addListener(marker, 'click', clickListener);
    }

    function clickListener() {
        if (activeWindow) activeWindow.close();
        activeWindow = this.infowindow;
        activeWindow.open(map, this);  
    }
}
