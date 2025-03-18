import { ApiProperty } from "@nestjs/swagger";
import { IsObject, ValidateNested } from "class-validator";

export class SubmitQuizDto {

    @ApiProperty({
        description: 'quiz answers from the user',
        example: {
            1: "blue"
        },
      })
    @IsObject()
    @ValidateNested()
    answers: Record<string, string>; // Key is questionId, value is the selected answer
  }