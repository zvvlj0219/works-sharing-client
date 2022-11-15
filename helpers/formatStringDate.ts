    // 1 Jan
    // 2 Feb
    // 3 Mar
    // 4 Apr
    // 5 May
    // 6 Jun
    // 7 Jul
    // 8 Aug
    // 9 Sep
    // 10 Oct
    // 11 Nov
    // 12 Dec

export const formatStringDate  = (createdDate: string): string => {
    const string_month = createdDate.split(' ')[1]

    let month:(number | undefined) = undefined;

    switch(string_month){
        case 'Jan':
            month = 1
        break
        case 'Feb':
            month = 2
        break
        case 'Mar':
            month = 3
        break
        case 'Apr':
            month = 4
        break
        case 'May':
            month = 5
        break
        case 'Jun':
            month = 6
        break
        case 'Jul':
            month = 7
        break
        case 'Aug':
            month = 8
        break
        case 'Sep':
            month = 9
        break
        case 'Oct':
            month = 10
        break
        case 'Nov':
            month = 11
        break
        case 'Dec':
            month = 12
        break
    }

    const day = createdDate.split(' ')[2]
    const year = createdDate.split(' ')[3]
    const formatedDate = `
        ${year}年${month}月${day}日
    `
    return formatedDate
}