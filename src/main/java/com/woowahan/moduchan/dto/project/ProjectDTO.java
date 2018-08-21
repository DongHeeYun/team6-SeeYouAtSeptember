package com.woowahan.moduchan.dto.project;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.woowahan.moduchan.domain.project.Project;
import com.woowahan.moduchan.dto.product.ProductDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectDTO {
    private Long cid;
    private Long pid;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Long createdAt;
    private Long endAt;
    private Project.STATUS status;
    private String owner;
    private List<ProductDTO> products;
    private Long goalFundRaising;

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }
}
