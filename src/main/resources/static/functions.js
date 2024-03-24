var map = new naver.maps.Map(document.getElementById('map-container'), {
        center: new naver.maps.LatLng(37.5665, 126.9780), // 서울을 기본 중심으로 설정
        zoom: 15 // 기본 확대 레벨 설정
    });

    // 마커 리스트 객체 생성
    var markers=[];



    // 화면 위치를 얻기 위한 것들
    var bounds = map.getBounds(),
    southWest = bounds.getSW(),
    northEast = bounds.getNE(),
    lngSpan = northEast.lng() - southWest.lng(),
    latSpan = northEast.lat() - southWest.lat();







    // 검색 버튼 클릭 시 실행되는 함수
    document.getElementById("search-button").addEventListener("click", function() {
        var place = document.getElementById("search-input").value; // 입력된 장소 가져오기
        console.log(place);
        // 장소 검색을 위한 Geocoder 객체 생성
        search_address(place,map);
    });



    // 화면 움직임 감시하는 리스너, 아이들 상태 되면 업데이트 마커 됨

    naver.maps.Event.addListener(map, 'idle', function() {
        updateMarkers(map, markers);
    });



// 이 함수는 엔터 누르면 검색되는 그거.
function handleKeyPress(event) {
    // 엔터 키의 keyCode 값은 13입니다.
    if (event.keyCode === 13) {
        // 엔터 키를 눌렀을 때 버튼 클릭 이벤트를 발생시킵니다.
        document.getElementById("search-button").click();
    }
}


function search_address(place) {
        naver.maps.Service.geocode({ query: place }, function(status, response) {
            if (status === naver.maps.Service.Status.ERROR || response.v2.addresses.length == 0) {
                return alert('올바른 주소를 입력해주세요');
            }
            var result = response.v2; // 검색 결과의 컨테이너
            var items = result.addresses; // 검색 결과의 배열


            var lon = items[0].x; // 첫 번째 결과의 경도
            var lat = items[0].y; // 첫 번째 결과의 위도

            var move = new naver.maps.LatLng(lat, lon);
            map.setCenter(move);

            // 새로운 마커 생성 검색할 때 마다 생성됨, markers 리스트에 넣어서 나중애 관리가 되도록!
            var marker = new naver.maps.Marker({
                position:  new naver.maps.LatLng(lat, lon), // 마커의 위치 설정
                map:map
            });

            markers.push(marker); // 마커 관리할 객체

        });
    }


function updateMarkers(map, markers) {


var mapBounds = map.getBounds();
var marker, position;

for (var i = 0; i < markers.length; i++) {

    marker = markers[i]
    position = marker.getPosition();

    if (mapBounds.hasLatLng(position)) {
        showMarker(map, marker);
    } else {
        hideMarker(map, marker);
    }
}
}

function showMarker(map, marker) {

if (marker.getMap()) return;
marker.setMap(map);
}

function hideMarker(map, marker) {

if (!marker.getMap()) return;
marker.setMap(null);
}