import React from 'react'

type TextareaProps = {
    id?: string
    className?: string
    field_width?: number
    field_height?: number
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const TextareaField = ({
    id,
    className,
    field_width,
    field_height,
    value,
    onChange
}: TextareaProps) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e)
    }

    return (
        <textarea
            className={`textareaField_container ${className}`}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                onChangeHandler(event)
            }}
            id={id}
            role="textarea_field"
            style={{
                width: `${field_width}px`,
                height: `${field_height}px`,
                resize: 'none'
            }}
            value={value}
        />
    )
}

export default TextareaField
