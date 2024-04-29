const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmY2ZTViMzAwZGZhYTExNzRiOWZjYTQ2MzRiZDFmZiIsInN1YiI6IjY2MmNhYWFkMDI4ZjE0MDEyMjY4NjNkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gTlCS5gXG4YvlquCrXONsKEMiGdxp5se7jL6LKjQvpw'
    }
};
const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
let movies; //fetch로 가져온 영화리스트를 담을 전역변수

document.addEventListener('DOMContentLoaded', function () { //DOM이 로드되고 나서 실행됨
    document.getElementById('search-input').focus(); //커서 위치하기

    fetch(url, options)
        .then(response => response.json())
        .then(data => { //영화리스트 받아오기
            movies = data.results;
            movies.forEach((movieInfo) => {
                createCard(movieInfo); //페이지를 로드하면서 카드를 생성
            });
        })
        .catch(err => console.error(err));

    const searchButton = document.getElementById('search-btn'); //검색버튼 할당 *DOM이 로드되기 전에 실행시 addEventListner를 읽을 수 없음
    searchButton.addEventListener('click', function (event) {
        // 기본 동작 방지
        event.preventDefault();

        // 검색 함수 호출
        search();
    });
});

let createCard = movieInfo => { //카드생성
    const complete_poster_path = "https://image.tmdb.org/t/p/w500" + movieInfo.poster_path; //기본주소 + 크기(w) + 이미지주소
    const votePercentage = (movieInfo.vote_average / 10) * 100; // 평점을 백분율로 변환
    const newCard = `
    <div class="card mb-3 movie-card" style="max-width: 900px;" id=${movieInfo.id}>
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${complete_poster_path}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title movie-title">${movieInfo.title}</h5>
                    <p class="card-text">${movieInfo.overview}</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${votePercentage}%" aria-valuenow="${movieInfo.vote_average}" aria-valuemin="0" aria-valuemax="10"></div>
                    </div>
                    <p class="card-text"><small class="text-body-secondary">
                        Rating: ${movieInfo.vote_average}
                 </div>
            </div>
        </div>
    </div>`; //카드를 만드는 html
    /*const container = */document.querySelector('.card-list').insertAdjacentHTML('beforeend', newCard);
    //container.insertAdjacentHTML('beforeend', newCard); //카드리스트를 찾아서 html을 붙여준다

    document.getElementById(movieInfo.id).addEventListener('click', function () { //카드가 생성되기 전에 버튼을 할당하면 id를 찾을 수 없기때문에 생성시 버튼을 할당해준다.
        window.alert(`영화 id: ${movieInfo.id}`); //카드를 누르면 id를 알리는 창이 나온다. 
    });
}

function search() {
    const searchInput = document.getElementById('search-input').value; //검색창에 입력한 값을 받는다.
    clearCardList(); //이전에 있던 카드들을 없엔다.
    movies.forEach(movieInfo => {
        if (findOverlap(movieInfo.title, searchInput)) { //영화 리스트를 순회하면서 겹치는 문자가 있는지 검사하고, 있으면 생성한다.
            createCard(movieInfo);
        }
    });
}

function clearCardList() {
    const cardListSection = document.querySelector('.card-list');
    cardListSection.innerHTML = ''; //카드리스트의 html을 공백으로 바꾼다.
}

function findOverlap(info, input) {
    info = info.toLowerCase(); //대소문자 구분없이 비교하기위해 전부 입력값과 영화타이틀을 소문자로 바꾼다.
    input = input.toLowerCase();
    return info.includes(input); //includes함수를 사용해서 확인한다.
}