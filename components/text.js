import React from "react";
import styled from "styled-components/native";

export default function Text(props) {
  return <Font {...props}>{props.children}</Font>;
}

const Font = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    switch (true) {
      case title:
        return `font-size: 22px`;

      case medium:
        return `font-size: 20px`;

      case small:
        return `font-size: 15px`;
    }
  }}

  ${({ bold, light }) => {
    switch (true) {
      case bold:
        return `font-weight: 800`;

      case light:
        return `font-weight: 300; color: #999;`;
    }
  }}

${({ cancel }) => {
  switch (true) {
    case cancel:
      return `color: red`;
  }
}}
`;
