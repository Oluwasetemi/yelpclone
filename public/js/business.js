$('#submit').on('click', function (e) {
    e.preventDefault();
    let searchTag = $('#searchInput').val().trim();
    let locationTag = $('#locationInput').val().trim();
    sessionStorage.setItem('searchTag', `${searchTag}`);
    sessionStorage.setItem('locationTag', `${locationTag}`);
    location.replace("/search")
});


function initMap() {
    $.ajax({
        url: `/api/restaurant`,
        method: 'GET',
    }).then(function (data) {
        const queryAlias = window.location.search.substring(7)
        const phoneFormat = function (phone) {
            const areaCode = phone.substring(2, 5);
            const preFix = phone.substring(5, 8)
            const lastFour = phone.substring(8)
            return `(${areaCode})-${preFix}-${lastFour}`
        };
        data.map(function (obj) {
            if (queryAlias === obj.alias) {
                const latitude = obj.coordinates.latitude;
                const longitude = obj.coordinates.longitude;
                const name = obj.name;
                const state = obj.location.state;
                const street = obj.location.address1;
                const city = obj.location.city;
                const zipCode = obj.location.zip_code;
                const phone = phoneFormat(obj.phone);
                const url = obj.url;
                const directions = `https://www.google.com/maps/dir/?api=1&origin=my%20location&destination=${latitude},${longitude}&dir_action=navigate&travelmode=driving`

                const info = `<ul>
                <li><i class="fas fa-map-marker-alt"></i><p> <span>${street}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${state}, ${city} ${zipCode}</span></p></li>
                <li><i class="fas fa-directions"></i>&nbsp;<a target=_blank href=${directions}>Get Directions</a></li>
                <li><i class="fas fa-phone fa-flip-horizontal"></i>&nbsp;${phone}</li>
                <li><i class="fas fa-external-link-alt"></i>&nbsp;<a target=_blank href='${url}'>${name}</a></li>
                <li><i class="fas fa-mobile-alt"></i>&nbsp;<a href='#'>Send to your phone</a></li></ul>`;
                $('.mapBoxText').html(info);

                const uluru = { lat: latitude, lng: longitude };
                const map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: uluru,
                    tilt: 45,
                    disableDefaultUI: true
                });
                const marker = new google.maps.Marker({
                    position: uluru,
                    map: map,
                    title: `${name}`,
                    label: {
                        text: 'Yelp',
                        fontSize: '10px',
                    }
                });
            }
        })
    })

}
initMap()

$.ajax({ url: `/api/restaurant/${window.location.search}`, method: "GET" })
    .then(function (dataList) {
        //console.log(window.location.search)
        const newID = window.location.search.substring(7);
        //console.log(newID);
        for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].alias === newID) {
                //console.log(dataList[i])
                $(".review").attr("id", newID)
            }
        }

    })

$('.review').on('click', function (event) {
    event.preventDefault();
    if (event.target.id) {
        location.href = `review?alias=${event.target.id}`;

        //console.log(event)

    }
})