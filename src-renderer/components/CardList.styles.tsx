import { SwiperSlide } from "swiper/react";

import styled from "@emotion/styled";

import { Card } from "@components/Card";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const VerticalRoot = styled(Root)`
    display: flex;
    flex-wrap: wrap;
`;

export const HorizontalCard = styled(Card)`
    margin: 0;
`;

export const HorizontalSlide = styled(SwiperSlide)`
    width: ${({ theme }) => theme.spacing(23.75)};

    margin-right: ${({ theme }) => theme.spacing(2)};
`;
