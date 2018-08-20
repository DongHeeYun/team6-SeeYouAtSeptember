package com.woowahan.moduchan.domain.project;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.woowahan.moduchan.domain.category.Category;
import com.woowahan.moduchan.domain.product.Product;
import com.woowahan.moduchan.domain.user.NormalUser;
import com.woowahan.moduchan.dto.product.ProductDTO;
import com.woowahan.moduchan.dto.project.ProjectDTO;
import com.woowahan.moduchan.support.BaseTimeEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Entity
@Where(clause = "deleted=false")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String title;
    @Lob
    private String description;
    @NotNull
    private String thumbnailUrl;
    @NotNull
    private Long goalFundRaising;
    @NotNull
    private Date endAt;
    private STATUS status;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private Category category;

    @ManyToOne
    @JoinColumn
    private NormalUser owner;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "project")
    private List<Product> products;

    @NotNull
    private boolean deleted;

    public static Project from(ProjectDTO projectDTO, Category category, NormalUser owner) {
        return new ProjectBuilder()
                .title(projectDTO.getTitle())
                .description(projectDTO.getDescription())
                .thumbnailUrl(projectDTO.getThumbnailUrl())
                .goalFundRaising(projectDTO.getGoalFundRaising())
                .endAt(projectDTO.getEndAt())
                .status(STATUS.DRAFT)
                .deleted(false)
                .owner(owner)
                .category(category)
                .products(new ArrayList<>())
                .build();
    }

    public Project addProduct(ProductDTO productDTO) {
        products.add(Product.from(productDTO, this));
        return this;
    }

    public Project updateProject(ProjectDTO projectDTO, Category category) {
        this.description = projectDTO.getDescription();
        this.endAt = projectDTO.getEndAt();
        this.goalFundRaising = projectDTO.getGoalFundRaising();
        this.thumbnailUrl = projectDTO.getThumbnailUrl();
        this.title = projectDTO.getTitle();
        this.category = category;
        return this;
    }

    public void delete() {
        deleted = true;
        products.forEach(product -> product.delete());
    }

    public ProjectDTO toDTO() {
        return new ProjectDTO(
                category.toDTO().getId(),
                id,
                title,
                description,
                thumbnailUrl,
                getCreatedAt(),
                endAt,
                status,
                owner.toDTO().getName(),
                products.stream().map(product -> product.toDTO()).collect(Collectors.toList()),
                goalFundRaising,
                calculateFundraisingAmount());
    }

    private Long calculateFundraisingAmount() {
        return null;
    }

    public enum STATUS {
        DRAFT,
        EVALUATING,
        PUBLISHED,
        REJECTED,
        COMPLETE,
        INCOMPLETE
    }
}
