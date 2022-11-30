import styled from 'styled-components';

const ModalBackground = styled.section`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContentLayout = styled.div`
  padding: 55px 100px;
  width: fit-content;
  border-radius: 25px;
  background-color: var(--white);
`;
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 412px;
`;

interface Props {
  children: React.ReactElement[];
  setModal: React.Dispatch<boolean>;
}

export default function Modal({ children, setModal }: Props) {
  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).tagName === 'SECTION') setModal(false);
  };

  return (
    <ModalBackground onClick={closeModal}>
      <ModalContentLayout>
        <ModalContent className="content">{children}</ModalContent>
      </ModalContentLayout>
    </ModalBackground>
  );
}
