import React, {FC, KeyboardEvent, ReactElement, useEffect, useRef, useState} from "react";
import TextField from "@atlaskit/textfield";
import EmojiEmojiIcon from "@atlaskit/icon/glyph/emoji/emoji";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {EmojiClickData} from "emoji-picker-react/src/types/exposedTypes";

export const MyTextFieldWithEmoji: FC<{
	defaultValue: string;
	onChange: (value: string) => void;
}> = ({defaultValue, onChange}): ReactElement => {

	const [isEmojiVisible, setIsEmojiVisible] = useState(false);
	const ref = useRef(null);

	const openEmojiSelector = () => {
		setIsEmojiVisible(!isEmojiVisible);
	};

	const finish = () => {
		if (ref.current) {
			const el = ref.current as HTMLInputElement;
			onChange(el.value);
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			// submit changes on Enter
			finish();
		}
	};

	const onEmojiSelected = (value: EmojiClickData) => {
		setIsEmojiVisible(false);
		if (ref.current) {
			const el = ref.current as HTMLInputElement;
			if (el.selectionStart && el.selectionEnd) {
				// add emoji at cursor
				el.setRangeText(value.emoji, el.selectionStart, el.selectionEnd, "end");

				// we lost focus after opening emoji picker
				el.focus();

				// set cursor to after the new emoji
				el.setSelectionRange(el.selectionStart + 1, el.selectionStart + 1);
			} else {
				// empty value, doesn't have any selection set
				el.value += value.emoji;
				el.focus();
			}
		}
	};

	const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (e.relatedTarget == null) {
			finish();
		}

		if (e.relatedTarget) {
			if (e.relatedTarget.closest(".emoji-picker") === null) {
				// not an emoji
				finish();
			}
		}
	};

	useEffect(() => {
		if (ref.current) {
			// automatically focus the input element
			(ref.current as HTMLInputElement).focus();
		}
	}, []);

	return (
		<div style={{position: "relative"}}>
			<TextField
				ref={ref}
				defaultValue={defaultValue}
				onBlur={onBlur}
				onKeyDown={onKeyDown}
				placeholder="Click to enter text"
				isRequired={true}
				isCompact={true}
				appearance="subtle"
				testId="my-textfield-with-emoji"
				elemAfterInput={
					<div style={{display: "inline-block", cursor: "pointer"}} onClick={openEmojiSelector}>
						<EmojiEmojiIcon label="" testId="emoji-icon-in-textfield"/>
					</div>
				}
			/>

			{isEmojiVisible &&
				<div style={{position: "absolute", zIndex: 100, top: "3em"}} className="emoji-picker">
					<EmojiPicker autoFocusSearch={false} onEmojiClick={onEmojiSelected} emojiStyle={EmojiStyle.NATIVE} height="256px" previewConfig={{showPreview: false}} data-testid="emoji-picker"/>
				</div>
			}
		</div>
	);
};
