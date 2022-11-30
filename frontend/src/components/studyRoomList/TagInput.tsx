import styled from 'styled-components';

const TagInputLayout = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 21px 28px;
  border: 2px solid #ff8a00;
  border-radius: 15px;
  font-size: 18px;

  &::placeholder {
    color: #ffc7a1;
  }
`;

const GuideText = styled.div`
  margin: 8px 0 10px 7px;
  color: var(--guideText);
  font-size: 14px;
`;

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const TagItem = styled.li`
  display: flex;
  align-items: center;
  background-color: #fedba7;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
`;

const RemoveButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-left: 7px;
  width: 20px;
  height: 20px;
  background-color: var(--white);
  border-radius: 100%;
`;

interface Props {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagInput({ tagList, setTagList }: Props) {
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tagList.length === 5) {
      (e.target as HTMLInputElement).value = '';
      return;
    }

    const newTag = (e.target as HTMLInputElement).value.trim();
    if (newTag !== '' && !tagList.includes(newTag)) {
      setTagList([...tagList, (e.target as HTMLInputElement).value]);
    }
    (e.target as HTMLInputElement).value = '';
  };

  const removeTag = (indexToRemove: number) => {
    setTagList([...tagList.filter((_, index) => index !== indexToRemove)]);
  };

  return (
    <TagInputLayout>
      <Input
        type="text"
        onKeyUp={(e) => (e.key === 'Enter' ? addTag(e) : null)}
        placeholder="원하는 태그를 입력 후, Enter를 입력하세요."
      />
      <GuideText>※ 태그는 최대 5개까지 입력 가능합니다.</GuideText>
      <TagList>
        {tagList.map((tag, index) => (
          <TagItem key={tag}>
            <span className="tagName">{tag}</span>
            <RemoveButton type="button" onClick={() => removeTag(index)}>
              x
            </RemoveButton>
          </TagItem>
        ))}
      </TagList>
    </TagInputLayout>
  );
}
