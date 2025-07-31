import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="footer-customer-center">
                <div className="left">
                    <h2>고객센터 <i className="fas fa-chevron-right"></i></h2>
                    <strong>1670-0876</strong>
                    <p>평일 09:00~18:00 (주말&공휴일 제외)</p>
                </div>
                <div className="right">
                    <button>카톡 상담 (평일 09:00~18:00)</button>
                    <button>이메일 문의</button>
                </div>
            </div>
            <div className="footer-links">
                <div className="link-column">
                    <a href="#">회사소개</a>
                    <a href="#">채용정보</a>
                    <a href="#">이용약관</a>
                    <a href="#"><strong>개인정보처리방침</strong></a>
                    <a href="#">공지사항</a>
                    <a href="#">권리보호센터</a>
                </div>
                 <div className="link-column">
                    <a href="#">입점신청</a>
                    <a href="#">제품/광고 문의</a>
                    <a href="#">시공파트너 안내</a>
                    <a href="#"><strong>파트너 개인정보처리방침</strong></a>
                    <a href="#">상품광고 고객센터</a>
                    <a href="#">고객의 소리</a>
                    {/* 오빠, 나중에 관리자 페이지 프로젝트의 실제 주소로 이 href 값을 바꿔주세요! */}
                    <a href="#" target="_blank" rel="noopener noreferrer">관리자 페이지</a>
                </div>
            </div>
            <div className="footer-info">
                 <p>(주)버킷플레이스 | 대표이사 이승재 | 서울 서초구 서초대로74길 4 삼성생명서초타워 25층, 27층</p>
                 <p>contact@bucketplace.net | 사업자등록번호 119-86-91245 <a href="#">사업자정보확인</a></p>
                 <p>통신판매업신고번호 제2018-서울서초-0580호</p>
                 <p>고객님이 현금결제한 금액에 대해 우리은행과 채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다. <a href="#">서비스가입사실확인</a></p>
                 <div className="footer-logos">
                    <span>(주)버킷플레이스는 통신판매중개자로서 통신판매의 당사자가 아니며, 판매자가 등록한 상품정보 및 거래에 대해 책임을 지지 않습니다. 단, (주)버킷플레이스가 판매자로 등록 판매한 상품은 판매자로서 책임을 부담합니다.</span>
                    <div className="logos">
                         {/* 로고 이미지들이 들어갈 자리입니다 */}
                    </div>
                 </div>
                 <div className="footer-social">
                     <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                     <a href="#" aria-label="Youtube"><i className="fab fa-youtube"></i></a>
                     <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                     <a href="#" aria-label="Naver Post"><i className="fa fa-bold"></i></a>
                 </div>
                 <p className="copyright">Copyright 2014. bucketplace, Co., Ltd. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
