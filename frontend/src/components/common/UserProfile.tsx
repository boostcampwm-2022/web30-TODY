import styled from 'styled-components';
import sampleImage from '../../assets/sample.jpg';

const Profile = styled.div``;

const UserProfileImage = styled.img`
  margin-top: 148px;
  margin-bottom: 15px;
  width: 149px;
  height: 149px;
`;

const UserProfileName = styled.div`
  margin-bottom: 142px;
  font-family: 'yg-jalnan';
  font-weight: 700;
  font-size: 22px;
`;

interface Props {
  src?: string;
}

export default function UserProfile({ src }: Props) {
  return (
    <Profile>
      <UserProfileImage src={src} alt="sample" />
      <UserProfileName>멍냥</UserProfileName>
    </Profile>
  );
}

UserProfile.defaultProps = {
  src: sampleImage,
};
