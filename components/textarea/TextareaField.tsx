import React from 'react'

type TextareaProps = {
    field_width: number
    field_height: number
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TextareaField = ({
    field_width,
    field_height,
    value,
    onChange
}: TextareaProps) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e)
    }

    return (
        <div className="textareaField_container">
            <textarea
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    onChangeHandler(event)
                }}
                role="textarea_field"
                style={{
                    width: `${field_width}px`,
                    height: `${field_height}px`,
                    resize: 'none'
                }}
                value={value}
            />
        </div>
    )
}

export default TextareaField
