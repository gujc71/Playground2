function getMarker(place) {
    var str= '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + place.PGNAME +'</div>' + 
            '        <div class="body">' + 
            '            <div class="img"><img src="/images/noimage.png" width="73" height="70"></div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">' + place.PGADDR + '</div>'+
            '                <div>';
            if (place.PGURL) str += '<a href="' + place.PGURL + '" target="_blank" class="link">홈페이지</a>';
            str += '               <a href="http://map.daum.net/link/to/' + place.PGNAME + ',' + place.PGLON + ',' + place.PGLAT + '" target="_blank">길찾기</a>' + 
            '                </div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';    
    return str;
};

var activeWindow = null

function showMap(mapContainer, center, positions) {
    var mapOption = { 
        center: center? center: positions[0].latlng, // 지도의 중심좌표
        level: positions.length>1 ? 5 : 3 // 지도의 확대 레벨
    };

    var markerList = [];// add by gu
    var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    //var markerImage = new daum.maps.MarkerImage( "/images/marker.png", new daum.maps.Size(24, 35)); 
    var showSmall = positions.length > 30;
    if (showSmall)
        var markerImage ={
            A: new daum.maps.MarkerImage( "/images/markerA.png", new daum.maps.Size(8, 8)), 
            B: new daum.maps.MarkerImage( "/images/markerB.png", new daum.maps.Size(8, 8)), 
            C: new daum.maps.MarkerImage( "/images/markerC.png", new daum.maps.Size(8, 8)), 
            D: new daum.maps.MarkerImage( "/images/markerD.png", new daum.maps.Size(8, 8)), 
            Z: new daum.maps.MarkerImage( "/images/markerZ.png", new daum.maps.Size(8, 8)), 
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
        marker.place = positions[i].place;   // add by gu
        markerList.push(marker);

        var infowindow = new daum.maps.InfoWindow({
            content: positions[i].content, // 인포윈도우에 표시할 내용
            removable : true,
            position: marker.getPosition()       
        });
        marker.infowindow = infowindow;
        
        if (positions.length===1) {
            infoopen(map, marker);
        }

        daum.maps.event.addListener(marker, 'click', clickListener);
        
        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다 
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        //daum.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
        //daum.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
    }

    function clickListener() {
        if (activeWindow) activeWindow.close();
        activeWindow = this.infowindow;
        activeWindow.open(map, this);  
    }

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
    if (showSmall)
        var markerImage ={
            A: new daum.maps.MarkerImage( "/images/markerA.png", new daum.maps.Size(8, 8)), 
            B: new daum.maps.MarkerImage( "/images/markerB.png", new daum.maps.Size(8, 8)), 
            C: new daum.maps.MarkerImage( "/images/markerC.png", new daum.maps.Size(8, 8)), 
            D: new daum.maps.MarkerImage( "/images/markerD.png", new daum.maps.Size(8, 8)), 
            Z: new daum.maps.MarkerImage( "/images/markerZ.png", new daum.maps.Size(8, 8)), 
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
        marker.place = positions[i].place;   // add by gu
        markerList.push(marker);

        var infowindow = new daum.maps.InfoWindow({
            content: positions[i].content, // 인포윈도우에 표시할 내용
            removable : true,
            position: marker.getPosition()       
        });
        marker.infowindow = infowindow;
        
        if (positions.length===1) {
            infoopen(map, marker);
        }

        daum.maps.event.addListener(marker, 'click', clickListener);
    }

    function clickListener() {
        if (activeWindow) activeWindow.close();
        activeWindow = this.infowindow;
        activeWindow.open(map, this);  
    }
}
