import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { UserTypes } from "src/enums/user.enum";
import * as crypto from 'crypto';
import { getMetadataArgsStorage } from 'typeorm';


interface PaginationData {
    take: number;
    skip: number;
}

interface Entity {
    // Add any other properties you might expect from your entity classes
    new(): any; // This ensures the entity can be instantiated
}

interface ApplySortingParams {
    entity: any; // Main entity (e.g., SubDistrictEntity, BlockEntity, etc.)
    sortBy?: string; // Sort column passed by the user (e.g., 'subdistrict_name', 'dist_name', etc.)
    sortOrder?: string; // Sort order passed by the user ('ASC' or 'DESC')
    relations?: { [key: string]: string }; // Relation alias to the entity columns (e.g., { dist_name: 'district.name' })
    alias: string; // Query builder alias for the main entity
}

// export function formatDate(data:any){ return moment(data).format("DD/MM/YYYY"); }

export const getUserTypeName = (type: number): string => {
    switch (type) {
        case UserTypes.ADMIN:
            return 'Admin';
        case UserTypes.EMPLOYEE:
            return 'Employee';
        case UserTypes.AGENT:
            return 'Agent';
        default:
            return 'Unknown';
    }
}

export const generatePassword = (length = 10) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+={}<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};


export class CreatedBy {
    @ApiProperty({
        description: `created_by`,
    })
    created_by: number;
}
export class email {
    @ApiProperty({
        description: `email`,
    })
    email: string;
}






export const generateOtp = (): string => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character OTP
}

export const applyPagination = (page: string | number = 1): PaginationData => {
    let currentPage = Number(page);

    // Check if currentPage is NaN or less than 1
    if (isNaN(currentPage) || currentPage <= 0) {
        currentPage = 1;
    }

    const take = 100; // Number of records to fetch (like limit)
    const skip = (currentPage - 1) * take; // Number of records to skip (like offset)

    return {
        take,
        skip
    };
};

export const applySorting = <T extends Entity>(
    sortBy: string | undefined,
    sortOrder: string | undefined,
    entity: T
): { [key: string]: 'ASC' | 'DESC' } => {
    const order: { [key: string]: 'ASC' | 'DESC' } = {};

    // Get all columns from TypeORM metadata
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns
        .filter(column => column.target === entity)
        .map(column => column.propertyName);

    // console.log('Available columns:', columns);

    if (sortBy && columns.includes(sortBy)) {
        order[sortBy] = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    } else {
        // console.warn(`Invalid sortBy field: ${sortBy}, defaulting to no sorting.`);
    }

    return order;
};

export const applySortingJoin = ({
    entity,
    sortBy,
    sortOrder,
    relations = {},
    alias, // Add alias parameter
}: ApplySortingParams) => {
    // Get all columns from TypeORM metadata for the main entity
    const metadata = getMetadataArgsStorage();
    const entityColumns = metadata.columns
        .filter(column => column.target === entity)
        .map(column => column.propertyName);

    let sortField: string = `${alias}.id`; // Use alias for default sorting

    if (sortBy && entityColumns.includes(sortBy)) {
        // If the sortBy exists in the main entity
        sortField = `${alias}.${sortBy}`; // Use the provided alias
    } else if (sortBy && relations[sortBy]) {
        // If the sortBy matches a relation alias (like 'dist_name')
        sortField = relations[sortBy]; // Use the relation column (e.g., 'district.name')
    }

    // Default sortOrder to 'ASC' if invalid or not provided
    const validSortOrder: "ASC" | "DESC" = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return {
        sortField,
        sortOrder: validSortOrder,
    };
};

export const matchdetails = [
    {
        "matchOrder": "Match 1",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "MAR, SAT 22",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 2",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "MAR, SUN 23",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 3",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "MAR, SUN 23",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 4",
        "groundName": "Dr YS Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "MAR, MON 24",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 5",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Punjab Kings",
        "matchDate": "MAR, TUE 25",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 6",
        "groundName": "Barsapara Cricket Stadium, Guwahati",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "MAR, WED 26",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 7",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "MAR, THU 27",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 8",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "MAR, FRI 28",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 9",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "MAR, SAT 29",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 10",
        "groundName": "Dr YS Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "MAR, SUN 30",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 11",
        "groundName": "Barsapara Cricket Stadium, Guwahati",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "MAR, SUN 30",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 12",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "MAR, MON 31",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 13",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Punjab Kings",
        "matchDate": "APR, TUE 1",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 14",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "APR, WED 2",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 15",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "APR, THU 3",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 16",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "APR, FRI 4",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 17",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "APR, SAT 5",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 18",
        "groundName": "New PCA Stadium, New Chandigarh",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "APR, SAT 5",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 19",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "APR, SUN 6",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 20",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "APR, SUN 6",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 21",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "APR, MON 7",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 22",
        "groundName": "New PCA Stadium, New Chandigarh",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "APR, TUE 8",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 23",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "APR, WED 9",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 24",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "APR, THU 10",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 25",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "APR, FRI 11",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 26",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "APR, SAT 12",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 27",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Punjab Kings",
        "matchDate": "APR, SAT 12",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 28",
        "groundName": "Sawai Mansingh Stadium, Jaipur",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "APR, SUN 13",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 29",
        "groundName": "Arun Jaitley Stadium, Delhi",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "APR, SUN 13",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 30",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "APR, MON 14",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 31",
        "groundName": "New PCA Stadium, New Chandigarh",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "APR, TUE 15",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 32",
        "groundName": "Arun Jaitley Stadium, Delhi",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "APR, WED 16",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 33",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "APR, THU 17",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 34",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Punjab Kings",
        "matchDate": "APR, FRI 18",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 35",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "APR, SAT 19",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 36",
        "groundName": "Sawai Mansingh Stadium, Jaipur",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "APR, SAT 19",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 37",
        "groundName": "New PCA Stadium, New Chandigarh",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "APR, SUN 20",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 38",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "APR, SUN 20",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 39",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "APR, MON 21",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 40",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "APR, TUE 22",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 41",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "APR, WED 23",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 42",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "APR, THU 24",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 43",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "APR, FRI 25",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 44",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Punjab Kings",
        "matchDate": "APR, SAT 26",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 45",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "APR, SUN 27",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 46",
        "groundName": "Arun Jaitley Stadium, Delhi",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "APR, SUN 27",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 47",
        "groundName": "Sawai Mansingh Stadium, Jaipur",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "APR, MON 28",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 48",
        "groundName": "Arun Jaitley Stadium, Delhi",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "APR, TUE 29",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 49",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Punjab Kings",
        "matchDate": "APR, WED 30",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 50",
        "groundName": "Sawai Mansingh Stadium, Jaipur",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "MAY, THU 1",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 51",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "MAY, FRI 2",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 52",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "MAY, SAT 3",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 53",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "MAY, SUN 4",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 54",
        "groundName": "Himachal Pradesh Cricket Association Stadium, Dharamsala",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "MAY, SUN 4",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 55",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "MAY, MON 5",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 56",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "MAY, TUE 6",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 57",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "Kolkata Knight Riders",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "MAY, WED 7",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 58",
        "groundName": "Himachal Pradesh Cricket Association Stadium, Dharamsala",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "MAY, THU 8",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 59",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Royal Challengers Bengaluru",
        "matchDate": "MAY, FRI 9",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 60",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "Sunrisers Hyderabad",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "MAY, SAT 10",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 61",
        "groundName": "Himachal Pradesh Cricket Association Stadium, Dharamsala",
        "homeTeamName": "Punjab Kings",
        "awayTeamName": "Mumbai Indians",
        "matchDate": "MAY, SUN 11",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 62",
        "groundName": "Arun Jaitley Stadium, Delhi",
        "homeTeamName": "Delhi Capitals",
        "awayTeamName": "Gujarat Titans",
        "matchDate": "MAY, SUN 11",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 63",
        "groundName": "MA Chidambaram Stadium, Chennai",
        "homeTeamName": "Chennai Super Kings",
        "awayTeamName": "Rajasthan Royals",
        "matchDate": "MAY, MON 12",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 64",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "MAY, TUE 13",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 65",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Lucknow Super Giants",
        "matchDate": "MAY, WED 14",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 66",
        "groundName": "Wankhede Stadium, Mumbai",
        "homeTeamName": "Mumbai Indians",
        "awayTeamName": "Delhi Capitals",
        "matchDate": "MAY, THU 15",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 67",
        "groundName": "Sawai Mansingh Stadium, Jaipur",
        "homeTeamName": "Rajasthan Royals",
        "awayTeamName": "Punjab Kings",
        "matchDate": "MAY, FRI 16",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 68",
        "groundName": "M Chinnaswamy Stadium, Bengaluru",
        "homeTeamName": "Royal Challengers Bengaluru",
        "awayTeamName": "Kolkata Knight Riders",
        "matchDate": "MAY, SAT 17",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Match 69",
        "groundName": "Narendra Modi Stadium, Ahmedabad",
        "homeTeamName": "Gujarat Titans",
        "awayTeamName": "Chennai Super Kings",
        "matchDate": "MAY, SUN 18",
        "matchTime": "3:30 pm IST"
    },
    {
        "matchOrder": "Match 70",
        "groundName": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
        "homeTeamName": "Lucknow Super Giants",
        "awayTeamName": "Sunrisers Hyderabad",
        "matchDate": "MAY, SUN 18",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Qualifier 1",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "TBD",
        "awayTeamName": "TBD",
        "matchDate": "MAY, TUE 20",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Eliminator",
        "groundName": "Rajiv Gandhi International Stadium, Hyderabad",
        "homeTeamName": "TBD",
        "awayTeamName": "TBD",
        "matchDate": "MAY, WED 21",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Qualifier 2",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "TBD",
        "awayTeamName": "TBD",
        "matchDate": "MAY, FRI 23",
        "matchTime": "7:30 pm IST"
    },
    {
        "matchOrder": "Final",
        "groundName": "Eden Gardens, Kolkata",
        "homeTeamName": "TBD",
        "awayTeamName": "TBD",
        "matchDate": "MAY, SUN 25",
        "matchTime": "7:30 pm IST"
    }
]