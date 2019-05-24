CREATE TABLE COM_USER(
  USERNO 	INT(11) NOT NULL AUTO_INCREMENT COMMENT '사용자 번호',
  USERID 	VARCHAR(20)						COMMENT 'ID',
  USERNM 	VARCHAR(20)						COMMENT '사용자 이름',   -- or 가게이름
  USERPW 	VARCHAR(100)					COMMENT '비밀번호',
  USERROLE	CHAR(1)							COMMENT '권한',
  PHOTO 	VARCHAR(50)						COMMENT '사진',
  ENTRYDATE DATETIME						COMMENT '작성일자',
  DELETEFLAG CHAR(1)						COMMENT '삭제 여부',
  PRIMARY KEY (USERNO)
) ;

/*------------------------------------------*/

INSERT INTO `com_user` (`USERNO`, `USERID`, `USERNM`, `USERPW`, `USERROLE`, `PHOTO`, `ENTRYDATE`, `DELETEFLAG`) VALUES
	(1, 'admin', 'admin', SHA2('admin', 256), 'A', NULL, now(), 'N'),
	(2, 'user1', 'Lee SunSin', SHA2('user1', 256), 'U', NULL, now(), 'N'),
	(3, 'user2', 'So SiNo', SHA2('user2', 256), 'U', NULL, now(), 'N');

/* ========================================================================= */

CREATE TABLE TBL_PLAYGROUND (
	PGNO 	VARCHAR(10)		COMMENT '장소NO',
	PGNAME 	VARCHAR(50)		COMMENT '장소명',
  PGLAT 	FLOAT(10,7)	COMMENT '위도',		
  PGLON 	FLOAT(10,7)	COMMENT '경도',
  PGURL 	VARCHAR(120)  COMMENT 'URL',
  PGTEL 	VARCHAR(50)  COMMENT '전화',
  PGADDR 	VARCHAR(70)		COMMENT '주소',
  PGTYPE1 	CHAR(1)		COMMENT '장소 종류', -- A: 키즈카페, b: 놀이터, C: 박물관
  PGTYPE2 	CHAR(6)		COMMENT '장소 종류',
  PGSIZE		FLOAT		COMMENT '소재지면적',
  PGPRICE 	VARCHAR(300)  COMMENT '가격',
  PGDESC		VARCHAR(1600) COMMENT '개요/설명',
  PGEXTRA1 	VARCHAR(200)		COMMENT '기타정보',
  PGEXTRA2 	VARCHAR(200)		COMMENT '기타정보',
  PGEXTRA3 	VARCHAR(2000)		COMMENT '기타정보',
  UPDATEDATE  DATETIME			COMMENT '수정일자',
  DELETEFLAG 	CHAR(1)				COMMENT '삭제'
);

ALTER TABLE TBL_PLAYGROUND ADD CONSTRAINT INX_PLAYGROUND    PRIMARY KEY (PGNO);


-- DROP TABLE TBL_COURSEMST;
    
CREATE TABLE TBL_COURSEMST (
	CMNO 	      INT		        	COMMENT '경로 master NO',
	CMTITLE     VARCHAR(50)			COMMENT '경로 제목',
  CMDESC 	    VARCHAR(1000)		COMMENT '설명',
  CMIMAGE	 	  VARCHAR(50)			COMMENT '대표이미지',
  CMSHOW	 	  CHAR(1)			    COMMENT '사용자에게 출력여부',
  UPDATEDATE  DATETIME	    	COMMENT '수정일자',
  DELETEFLAG 	CHAR(1)		    	COMMENT '삭제',
	PRIMARY KEY (CMNO)
);


-- DROP TABLE TBL_COURSEDTL ;

CREATE TABLE TBL_COURSEDTL (
	CDNO 	INT		NOT NULL AUTO_INCREMENT COMMENT '경로 detail NO',
	CMNO 	INT			    	COMMENT '경로 master NO',
	PGNO 	VARCHAR(10)			COMMENT '장소NO',
	CDORDER	INT					COMMENT '정렬',
	PRIMARY KEY (CDNO)
);

CREATE TABLE COM_CODE(
  CLASSNO     	VARCHAR(4)      COMMENT '대분류',
  CODECD 	      VARCHAR(10)     COMMENT '코드',
  CODENM 	      VARCHAR(30)     COMMENT '코드명',
  PRIMARY KEY (CLASSNO, CODECD)
) ;

INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('e', 'A', 'home');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('e', 'B', 'accessibility');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('e', 'C', 'account_balance');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('e', 'D', 'library_books');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('e', 'Z', 'tag_faces');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'B', '큰놀이터');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'N', '창의놀이터');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'PN', '공립');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'NA', '국립');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'UN', '대학');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'PR', '사립');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'P', '공공도서관');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'S', '작은도서관');
INSERT INTO COM_CODE(CLASSNO, CODECD, CODENM) VALUES('t', 'H', '장애인도서관');

INSERT INTO `TBL_COURSEDTL` (`CDNO`, `CMNO`, `PGNO`, `CDORDER`) VALUES
	(8, 1, 'B000554299', 1),
	(9, 1, 'B000559552', 2),
	(10, 1, 'C000000516', 5),
	(11, 1, 'C000000935', 4),
	(12, 1, 'Z000000001', 3),
	(13, 2, 'B000025434', 1),
	(14, 2, 'D000000011', 4),
	(15, 2, 'A000000143', 5),
	(16, 2, 'C000000934', 3),
	(17, 2, 'C000000919', 2),
	(18, 3, 'C000000936', 1),
	(20, 3, 'Z000000003', 2),
	(21, 3, 'Z000000004', 3),
	(22, 3, 'A000000190', 4),
	(23, 6, 'C000000937', 1),
	(24, 6, 'D000000036', 2),
	(25, 6, 'B000041444', 3),
	(26, 6, 'Z000000007', 4),
	(27, 6, 'A000000285', 5),
	(28, 3, 'A000000280', 5),
	(29, 7, 'Z000000008', 1),
	(30, 7, 'B000508110', 3),
	(31, 7, 'Z000000009', 5),
	(37, 7, 'D000000009', 4),
	(38, 7, 'D000001390', 2);


INSERT INTO `TBL_COURSEMST` (`CMNO`, `CMTITLE`, `CMDESC`, `UPDATEDATE`, `DELETEFLAG`, `CMSHOW`, `CMIMAGE`) VALUES
	(1, '어린이 대공원 놀이터', '<p>어린이 대공원</p>', now(), 'N', 'Y', NULL),
	(2, '중계근린공원', '<p>중계동 공원</p><p>&nbsp;</p><p>한달에 한번꼴로 어린이 뮤지컬이 노원구민센터에서 진행된다.</p><p>별로도 확인하기는 어렵지만, 대부분 인터파크에 등록되기 때문에 인터파크에서 확인 후 간다면 좀더 즐거운 하루를 보낼 수 있을 것이다.</p><p>&nbsp;</p>', '2019-05-16 13:06:16', 'N', 'Y', NULL),
	(3, '동대문에서 쇼핑하는 동안', '<p>동대문</p>', now(), 'N', 'Y', NULL),
	(6, '중계동 나비 정원에서 천변으로', '<p>중계동 나비 정원을 들렸다가</p>', now(), 'N', 'Y', NULL),
	(7, '풍물 시장과 도서관', '<p>풍물 시장들</p>', now(), 'N', 'Y', NULL);


INSERT INTO `TBL_PLAYGROUND` (`PGNO`, `PGNAME`, `PGLAT`, `PGLON`, `PGURL`, `PGTEL`, `PGADDR`, `PGTYPE1`, `PGTYPE2`, `PGSIZE`, `PGPRICE`, `PGDESC`, `PGEXTRA1`, `PGEXTRA2`, `PGEXTRA3`, `UPDATEDATE`, `DELETEFLAG`) VALUES
	('A000000143', '상상노리 키즈카페', 127.0686722, 37.6398582, 'http://www.playtime.co.kr/KO/index.php', '070-7721-8970', '서울특별시 노원구 동일로204가길 12 (중계동, 홈플러스)', 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2019-05-12 23:42:19', 'N'),
	('A000000190', '어린이감각놀이터 디키디키', 127.0096283, 37.5668144, 'http://dikidiki.co.kr/main.do', '02-2153-0760', '서울특별시 중구 을지로 281 (을지로7가, 동대문디자인플라자(DDP) 배움터 4층)', 'A', 'B', 105.6, '', '', NULL, NULL, '', '2019-05-12 23:42:19', 'N'),
	('A000000280', '타요키즈카페 동대문두타몰점', 127.0087738, 37.5688858, 'http://www.tayokidscafe.co.kr/new/main/main.html', '02-3398-4339', '서울특별시 중구 장충단로 275 (을지로6가, 두산타워빌딩 5층 5004~5009호, 5318호 일부)', 'A', NULL, 84.2, NULL, NULL, NULL, NULL, NULL, '2019-05-12 23:42:19', 'N'),
	('A000000285', '타요키즈카페중계점', 127.0746536, 37.6573792, 'http://www.tayokidscafe.co.kr/new/main/main.html', '02-938-0120', '서울특별시 노원구 덕릉로 669 (중계동, 세양빌딩5층, 501호)', 'A', NULL, 153, NULL, NULL, NULL, NULL, NULL, '2019-05-12 23:42:19', 'N'),
	('B000025434', '중계근린공원', 127.0656891, 37.6397705, '', '', '서울특별시 노원구 동일로 1229 (중계동)', 'B', '', 0, '', '', '그네 1개\r\n흔들놀이기구 1개\r\n조합놀이대 1개\r\n충격흡수용표면재(포설도포바닥재) 1개\r\n', '검사종류 : 정기시설검사\r\n검사일자 : 2019-01-28\r\n유효기한 : 2021-01-30\r\n검사결과 : 합격\r\n', '', '2019-05-12 23:42:29', 'N'),
	('B000041444', '삿갓봉근린공원', 127.0763779, 37.6579514, NULL, NULL, '서울특별시 노원구 한글비석로 346 (중계동)', 'B', NULL, NULL, NULL, NULL, '조합놀이대 1개\r\n충격흡수용표면재(포설도포바닥재) 1개\r\n', '검사종류 : 정기시설검사\r\n검사일자 : 2019-01-29\r\n유효기한 : 2021-02-02\r\n검사결과 : 합격\r\n', NULL, '2019-05-12 23:42:29', 'N'),
	('B000508110', '우산각어린이공원', 127.0243149, 37.5733948, '', '', '서울특별시 동대문구 천호대로4길 22 (신설동)', 'B', '', 0, '', '', '그네 1개\r\n조합놀이대 2개\r\n충격흡수용표면재(포설도포바닥재) 2개\r\n', '검사종류 : 설치검사\r\n검사일자 : 2019-01-02\r\n유효기한 : 2019-09-26\r\n검사결과 : 합격\r\n', '', '2019-05-12 23:42:29', 'N'),
	('B000554299', '꿈틀꿈틀 놀이터', 127.0803757, 37.5481377, '', '', '서울특별시 광진구 능동로 216 (능동)어린이대공원 내', 'B', '', 0, '', '', '그네 1개\r\n회전놀이기구 1개\r\n흔들놀이기구 4개\r\n오르는기구 2개\r\n조합놀이대 2개\r\n기타 6개\r\n충격흡수용표면재(모래) 1개\r\n충격흡수용표면재(포설도포바닥재) 1개\r\n', '검사종류 : 설치검사\r\n검사일자 : 2018-11-13\r\n유효기한 : 2019-12-28\r\n검사결과 : 합격\r\n', '', '2019-05-12 23:42:29', 'N'),
	('B000559552', '맘껏놀이터 놀이시설', 127.0808792, 37.5508881, '', '', '서울특별시 광진구 능동로 216 (능동)서울어린이대공원', 'B', '', 0, '', '', '미끄럼틀 1개\r\n충격흡수용표면재(모래) 1개\r\n충격흡수용표면재(기타바닥재) 1개\r\n', '검사종류 : 설치검사\r\n검사일자 : 2017-04-18\r\n유효기한 : 2019-04-17\r\n검사결과 : 합격\r\n', '', '2019-05-12 23:42:29', 'N'),
	('C000000516', '서울상상나라', 127.0774994, 37.5508881, 'http://www.seoulchildrensmuseum.org', '02-6450-9500', '서울특별시 광진구 능동로 216', 'C', 'PN', 0, '어른관람료: 4000\r\n청소년관람료: 4000\r\n어린이관람료: 4000\r\n관람료기타정보: ', '', '평일관람시간시간: 00:00 - 00:00\r\n공휴일관람시간: 00:00 - 00:00\r\n휴관정보: 홈페이지참고', '', '', '2019-05-12 23:43:25', 'N'),
	('C000000919', '노원우주학교	', 127.0652161, 37.6407471, 'https://nowoncosmos.or.kr/', '02-971-6232', '서울특별시 노원구 동일로 205길 13', 'C', 'PN', 0, '소인(개인:1,000원/단체:1,000원) / 대인(개인:2,000원/단체:2,000원)', '우주와 생명과 인간,\r\n그 탄생과 진화의\r\n경이로운 시간과 함께 걷다\r\n\r\n우주의 여정\r\n\r\n이 세상 모든 것이 어떻게 해서 오늘날과 같이 되었으며 우리는 어디에 위치해 있고, 이 모든 것들은 어떻게 될 것인가?\r\n우주, 지구, 생명, 인류의 진화에 대한 모든 것, 우주학교의 전시물로 만나보세요 ', '일반관람 (09:30~17:30) 야간관측 (평일없음 19:30~21:00)', '', '', '2019-05-14 19:28:10', 'N'),
	('C000000934', '서울시립 북서울미술관', 127.0668640, 37.6406631, 'http://sema.seoul.go.kr/it/artinfo/northart/getIntro', '02 )2124-5248', '서울 노원구 동일로 1238', 'C', 'PN', 0, '무료', '‘갈대언덕’에서 연유한 노원이라는 지명을 살려 공원 속 작은 동산 위에 세워진 북서울미술관은 공원을 산책하며 자연스럽게 미술관과 가까워질 수 있도록 산책로와 미술관 출입구를 연결한 개방형 미술관입니다. \r\n\r\n시민들의 일상 속에 문화의 향기가 배어들 수 있도록 모두가 보고, 느끼고, 체험하고, 즐기며, 함께 할 수 있는 지역문화의 거점이 되겠습니다.', '관람시간\r\n평일(화-금) 10AM~8PM\r\n토·일·공휴일\r\n하절기 (3-10월)\r\n10 AM~ 7 PM\r\n동절기 (11-2월)\r\n10AM~ 6PM\r\n\r\n휴관일\r\n매주 월요일\r\n정기휴관 (1월1일)\r\n', '', '', '2019-05-14 19:34:17', 'N'),
	('C000000935', '아리수나라', 127.0776978, 37.5513039, 'http://arisumuseum.seoul.go.kr/arisunara/content/sub1_1.jsp', '', '서울특별시 광진구 능동로 216', 'C', 'PN', 0, '무료', '만6세~만10세(초등학교 4학년) 어린이를 대상으로 다양한 놀이와 체험을 통해 물과 환경의 중요성을 일깨우고, 서울 수돗물 “아리수”의 안전성과 우수성에 대한 정확한 이해를 돕기 위해 전국 최초로 어린이 수돗물체험 홍보관 “아리수나라”를 서울어린이대공원내에 개관(’10.10.26’)하였습니다.', '', '', '', NULL, 'N'),
	('C000000936', '한양도성박물관', 127.0085907, 37.5730019, 'http://www.museum.seoul.kr/scwm/NR_index.do', '', '서울특별시 종로구 율곡로283', 'C', 'PN', 0, '', '\r\n\r\n    지형과 한 몸이 되어 축조된 한양도성은 근대화 과정에서 일부 훼철되기도 하였지만, 오늘날까지 그 원형이 잘 남아 있어 도시와 공존하는 문화유산입니다.\r\n\r\n    동대문성곽공원에 위치한 한양도성박물관은 조선시대부터 현재에 이르기까지 한양도성의 역사와 문화를 담은 박물관으 로 상설전시실, 기획전시실, 도성정보센터와 학습실을 갖춘 문화공간입니다. 한양도성박물관에서 600년 한양도성의 역사 와 문화유산으로서의 미래가치를 확인하시기 바랍니다.\r\n', '', '', '', NULL, 'N'),
	('C000000937', '불암산 나비정원', 127.0806351, 37.6554794, 'https://www.facebook.com/BuramsanButterflyGarden/', '02-936-0900', '노원구 한글비석로12길 51-27', 'C', 'PN', 0, '', '', '영업종료 10:00~17:00 - 입장마감 16:30 , 휴무 월요일', '', '', NULL, 'N'),
	('D000000009', '서울특별시교육청동대문도서관', 127.0248566, 37.5734749, 'http://ddmlib.sen.go.kr/ddmlib_index.jsp', '02-2170-1000', '서울특별시 동대문구 천호대로4길 22', 'D', 'P', NULL, NULL, NULL, '\n매월 둘째, 넷째 수요일 및 일요일을 제외한 공휴일', NULL, NULL, '2019-05-18 16:43:10', 'N'),
	('D000000011', '서울특별시교육청노원평생학습관', 127.0676346, 37.6393242, 'HTTP://nwllc.sen.go.kr', '02-979-1741', '서울특별시 노원구 동일로204길 13', 'D', 'P', NULL, NULL, NULL, '\n매월 둘째, 넷째주 월요일', NULL, NULL, '2019-05-18 16:43:10', 'N'),
	('D000000036', '노원어린이도서관', 127.0766296, 37.6581726, 'https://www.nowonlib.kr/local/html/childrenLocation', '02-933-7145', '서울특별시 노원구 한글비석로 346', 'D', 'P', 0, '', '', '매주 화요일 및 법정 공휴일', '', '', '2019-05-18 16:43:10', 'N'),
	('D000001390', '아름꿈도서관(종로문화재단)', 127.0171204, 37.5727119, 'https://www.jfac.or.kr/site/main/content/arum_dream03', '02-2237-6644~5', '서울특별시 종로구 종로58가길 19', 'D', 'P', 0, '', '', '매주 일요일, 1월 1일, 설연휴, 추석연휴', '', '', '2019-05-18 16:43:10', 'N'),
	('Z000000001', '어린이 대공원 들판', 127.0798874, 37.5512886, '', '', '서울시 광진구 능동로 216 ', 'Z', '', 0, '', '', '', '', '', NULL, 'N'),
	('Z000000003', '낙산공원', 127.0074615, 37.5806465, '', '', '서울특별시 종로구 낙산길 41', 'Z', '', 0, '', '', '', '', '', NULL, 'N'),
	('Z000000004', '동대문 문구완구시장', 127.0144424, 37.5713425, 'https://www.ddmstm.com/', '', '서울 종로구 종로52길 36', 'Z', '', 0, '', '', '', '', '', NULL, 'N'),
	('Z000000007', '당현천 새싹교', 127.0720444, 37.6575584, '', '', '서울 노원구 중계동 453-8', 'Z', '', 0, '', '', '', '', '', NULL, 'N'),
	('Z000000008', '동묘공원', 127.0182495, 37.5731430, '', '', '서울 종로구 난계로27길 84', 'Z', '', 0, '', '', '', '', '', NULL, 'N'),
	('Z000000009', '서울풍물시장', 127.0251923, 37.5728226, 'http://pungmul.or.kr/', '', '서울 동대문구 천호대로4길 19-3', 'Z', '', 0, '', '', '', '', '', NULL, 'N');
    
    